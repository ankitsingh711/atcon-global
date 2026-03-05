import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const COLLECTIONS = [
    'users',
    'projects',
    'clients',
    'deals',
    'contacts',
    'activities',
    'approvals',
    'freelancerData',
    'invoices',
    'forms',
    'people',
    'supportTickets',
    'talent',
] as const;

type CollectionName = (typeof COLLECTIONS)[number];

type StoredRecord = {
    _id: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
};

type SortSpec = Record<string, number>;
type QueryFilter = Record<string, unknown> & { $or?: QueryFilter[] };

interface DbState {
    users: StoredRecord[];
    projects: StoredRecord[];
    clients: StoredRecord[];
    deals: StoredRecord[];
    contacts: StoredRecord[];
    activities: StoredRecord[];
    approvals: StoredRecord[];
    freelancerData: StoredRecord[];
    invoices: StoredRecord[];
    forms: StoredRecord[];
    people: StoredRecord[];
    supportTickets: StoredRecord[];
    talent: StoredRecord[];
}

interface ModelOptions {
    hiddenFields?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDoc = Record<string, any>;

export interface JsonDocument extends StoredRecord {
    id: string;
    toObject: () => StoredRecord;
    save: () => Promise<JsonDocument>;
}

export interface JsonModel {
    find: (filter?: QueryFilter) => JsonQuery<AnyDoc[]>;
    findOne: (filter?: QueryFilter) => JsonQuery<AnyDoc | null>;
    findById: (id: string) => JsonQuery<AnyDoc | null>;
    findByIdAndUpdate: (
        id: string,
        update: QueryFilter,
        _options?: Record<string, unknown>
    ) => JsonQuery<AnyDoc | null>;
    findByIdAndDelete: (id: string) => JsonQuery<AnyDoc | null>;
    countDocuments: (filter?: QueryFilter) => Promise<number>;
    create: (payload: Record<string, unknown>) => Promise<AnyDoc>;
    insertMany: (payload: Array<Record<string, unknown>>) => Promise<AnyDoc[]>;
    deleteMany: (filter?: QueryFilter) => Promise<{ acknowledged: boolean; deletedCount: number }>;
    aggregate: <T = AnyDoc>(pipeline: Array<Record<string, unknown>>) => Promise<T[]>;
}

const DB_FILE_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'json-db.json');

const EMPTY_STATE: DbState = {
    users: [],
    projects: [],
    clients: [],
    deals: [],
    contacts: [],
    activities: [],
    approvals: [],
    freelancerData: [],
    invoices: [],
    forms: [],
    people: [],
    supportTickets: [],
    talent: [],
};

declare global {
    var atconJsonDbCache: DbState | undefined;
}

function deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function generateRecordId(): string {
    return crypto.randomBytes(12).toString('hex');
}

export function isValidRecordId(id: string): boolean {
    return /^[a-fA-F0-9]{24}$/.test(id);
}

function toIsoString(value: unknown): string | null {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString();
    }

    if (typeof value === 'string' || typeof value === 'number') {
        const date = new Date(value);
        if (!Number.isNaN(date.getTime())) {
            return date.toISOString();
        }
    }

    return null;
}

function toJsonValue(value: unknown): unknown {
    if (
        value === null ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
    ) {
        return value;
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (Array.isArray(value)) {
        return value.map((item) => toJsonValue(item));
    }

    if (isPlainObject(value)) {
        const next: { [key: string]: unknown } = {};
        for (const [key, item] of Object.entries(value)) {
            if (item !== undefined) {
                next[key] = toJsonValue(item);
            }
        }
        return next;
    }

    return String(value);
}

function normalizeRecord(input: unknown): StoredRecord {
    const now = new Date().toISOString();
    const source = isPlainObject(input) ? input : {};

    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(source)) {
        if (value !== undefined) {
            data[key] = toJsonValue(value);
        }
    }

    const idValue = typeof data._id === 'string' ? data._id : generateRecordId();
    const createdAt = toIsoString(data.createdAt) ?? now;
    const updatedAt = toIsoString(data.updatedAt) ?? createdAt;

    return {
        ...data,
        _id: idValue,
        createdAt,
        updatedAt,
    } as StoredRecord;
}

function normalizeState(input: unknown): DbState {
    const next = deepClone(EMPTY_STATE);
    if (!isPlainObject(input)) {
        return next;
    }

    for (const collection of COLLECTIONS) {
        const entries = input[collection];
        if (!Array.isArray(entries)) {
            continue;
        }
        next[collection] = entries.map((entry) => normalizeRecord(entry));
    }

    return next;
}

function ensureDbFileExists(): void {
    const dirPath = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE_PATH)) {
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(EMPTY_STATE, null, 2), 'utf8');
    }
}

function readStateFromDisk(): DbState {
    try {
        ensureDbFileExists();
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf8');
        if (!raw.trim()) {
            return deepClone(EMPTY_STATE);
        }
        return normalizeState(JSON.parse(raw));
    } catch (error) {
        console.error('Failed to read JSON datastore. Using empty in-memory state.', error);
        return deepClone(EMPTY_STATE);
    }
}

function writeStateToDisk(state: DbState): void {
    ensureDbFileExists();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

function getState(): DbState {
    if (!global.atconJsonDbCache) {
        global.atconJsonDbCache = readStateFromDisk();
    }
    return global.atconJsonDbCache;
}

function mutateState<T>(mutation: (state: DbState) => T): T {
    const state = getState();
    const result = mutation(state);
    writeStateToDisk(state);
    global.atconJsonDbCache = state;
    return result;
}

function compareUnknown(left: unknown, right: unknown): number {
    if (left === right) {
        return 0;
    }

    if (left === null || left === undefined) {
        return -1;
    }

    if (right === null || right === undefined) {
        return 1;
    }

    const leftDate = toIsoString(left);
    const rightDate = toIsoString(right);
    if (leftDate && rightDate) {
        return leftDate.localeCompare(rightDate);
    }

    if (typeof left === 'number' && typeof right === 'number') {
        return left > right ? 1 : -1;
    }

    return String(left).localeCompare(String(right));
}

function applySort(records: StoredRecord[], sortSpec: SortSpec | null): StoredRecord[] {
    if (!sortSpec || Object.keys(sortSpec).length === 0) {
        return records;
    }

    const fields = Object.entries(sortSpec);
    return [...records].sort((a, b) => {
        for (const [field, rawDirection] of fields) {
            const direction = rawDirection < 0 ? -1 : 1;
            const comparison = compareUnknown(a[field], b[field]);
            if (comparison !== 0) {
                return comparison * direction;
            }
        }
        return 0;
    });
}

function valuesEqual(left: unknown, right: unknown): boolean {
    const leftDate = toIsoString(left);
    const rightDate = toIsoString(right);
    if (leftDate && rightDate) {
        return leftDate === rightDate;
    }

    if (isPlainObject(left) || isPlainObject(right) || Array.isArray(left) || Array.isArray(right)) {
        return JSON.stringify(left) === JSON.stringify(right);
    }

    return left === right;
}

function matchesCondition(value: unknown, condition: unknown): boolean {
    if (!isPlainObject(condition)) {
        return valuesEqual(value, condition);
    }

    if ('$regex' in condition) {
        const source = String(condition.$regex ?? '');
        const flags = typeof condition.$options === 'string' ? condition.$options : '';
        try {
            return new RegExp(source, flags).test(String(value ?? ''));
        } catch {
            return false;
        }
    }

    if ('$in' in condition && Array.isArray(condition.$in)) {
        return condition.$in.some((entry) => valuesEqual(value, entry));
    }

    return valuesEqual(value, condition);
}

function matchesFilter(record: StoredRecord, filter?: QueryFilter): boolean {
    if (!filter || Object.keys(filter).length === 0) {
        return true;
    }

    if (Array.isArray(filter.$or)) {
        const hasAnyMatch = filter.$or.some((orCondition) => matchesFilter(record, orCondition));
        if (!hasAnyMatch) {
            return false;
        }
    }

    for (const [key, condition] of Object.entries(filter)) {
        if (key === '$or') {
            continue;
        }
        if (!matchesCondition(record[key], condition)) {
            return false;
        }
    }

    return true;
}

function projectRecord(
    record: StoredRecord,
    options: ModelOptions,
    includeHiddenFields: Set<string>
): StoredRecord {
    const projected = deepClone(record);
    const hiddenFields = options.hiddenFields ?? [];

    for (const hiddenField of hiddenFields) {
        if (!includeHiddenFields.has(hiddenField)) {
            delete projected[hiddenField];
        }
    }

    return projected;
}

function extractPersistableRecord(document: StoredRecord): StoredRecord {
    const next: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(document)) {
        if (key === 'id' || value === undefined || typeof value === 'function') {
            continue;
        }
        next[key] = toJsonValue(value);
    }

    return normalizeRecord(next);
}

function toDocument(
    collection: CollectionName,
    record: StoredRecord,
    options: ModelOptions,
    includeHiddenFields: Set<string>
): JsonDocument {
    const document = projectRecord(record, options, includeHiddenFields) as JsonDocument;

    Object.defineProperty(document, 'id', {
        enumerable: false,
        get() {
            return String(document._id);
        },
    });

    Object.defineProperty(document, 'toObject', {
        enumerable: false,
        value: () => projectRecord(extractPersistableRecord(document), options, includeHiddenFields),
    });

    Object.defineProperty(document, 'save', {
        enumerable: false,
        value: async () => {
            const updatedRecord = extractPersistableRecord(document);
            updatedRecord.updatedAt = new Date().toISOString();

            mutateState((state) => {
                const collectionState = state[collection];
                const index = collectionState.findIndex((entry) => entry._id === updatedRecord._id);
                if (index === -1) {
                    collectionState.push(updatedRecord);
                } else {
                    collectionState[index] = updatedRecord;
                }
            });

            const refreshed = projectRecord(updatedRecord, options, includeHiddenFields);
            for (const key of Object.keys(document)) {
                if (key !== '_id') {
                    delete document[key];
                }
            }
            Object.assign(document, refreshed);
            return document;
        },
    });

    return document;
}

function toQueryFilter(filter: QueryFilter | undefined): QueryFilter {
    return filter ?? {};
}

function normalizePayload(payload: Record<string, unknown>): StoredRecord {
    return normalizeRecord(payload);
}

function applyUpdate(record: StoredRecord, update: QueryFilter): StoredRecord {
    const source = isPlainObject(update.$set) ? update.$set : update;
    const normalizedPatch = normalizePayload(source);
    const next = {
        ...record,
        ...normalizedPatch,
        _id: record._id,
        createdAt: record.createdAt,
        updatedAt: new Date().toISOString(),
    };
    return next;
}

function resolveExpression(record: StoredRecord, expression: unknown): unknown {
    if (typeof expression === 'string' && expression.startsWith('$')) {
        const key = expression.slice(1);
        return record[key];
    }
    return expression;
}

function resolveSum(record: StoredRecord, expression: unknown): number {
    const value = resolveExpression(record, expression);
    const numeric = Number(value ?? 0);
    return Number.isFinite(numeric) ? numeric : 0;
}

function applyGroupStage(records: StoredRecord[], stage: Record<string, unknown>): Record<string, unknown>[] {
    const groups = new Map<string, Record<string, unknown>>();

    for (const record of records) {
        const groupId = resolveExpression(record, stage._id);
        const groupKey = JSON.stringify(groupId ?? null);
        if (!groups.has(groupKey)) {
            const initial: Record<string, unknown> = { _id: groupId };
            for (const [field, operation] of Object.entries(stage)) {
                if (field === '_id') {
                    continue;
                }
                if (isPlainObject(operation) && '$sum' in operation) {
                    initial[field] = 0;
                }
            }
            groups.set(groupKey, initial);
        }

        const current = groups.get(groupKey);
        if (!current) {
            continue;
        }

        for (const [field, operation] of Object.entries(stage)) {
            if (field === '_id') {
                continue;
            }

            if (isPlainObject(operation) && '$sum' in operation) {
                current[field] = Number(current[field] ?? 0) + resolveSum(record, operation.$sum);
            }
        }
    }

    return Array.from(groups.values());
}

export class JsonQuery<TValue> implements PromiseLike<TValue> {
    private sortSpec: SortSpec | null = null;
    private limitCount: number | null = null;
    private useLean = false;
    private includeHiddenFields = new Set<string>();

    constructor(
        private readonly collection: CollectionName,
        private readonly options: ModelOptions,
        private readonly listFactory: () => StoredRecord[],
        private readonly expectsSingle: boolean
    ) {}

    sort(sortSpec: SortSpec): this {
        this.sortSpec = sortSpec;
        return this;
    }

    limit(limitCount: number): this {
        this.limitCount = limitCount;
        return this;
    }

    lean(): this {
        this.useLean = true;
        return this;
    }

    select(selectExpression: string): this {
        for (const token of selectExpression.split(/\s+/)) {
            if (token.startsWith('+') && token.length > 1) {
                this.includeHiddenFields.add(token.slice(1));
            }
        }
        return this;
    }

    private resolve(): TValue {
        let records = applySort(this.listFactory(), this.sortSpec);

        if (this.limitCount !== null) {
            records = records.slice(0, Math.max(0, this.limitCount));
        }

        if (this.expectsSingle) {
            const record = records[0];
            if (!record) {
                return null as TValue;
            }
            if (this.useLean) {
                return projectRecord(record, this.options, this.includeHiddenFields) as TValue;
            }
            return toDocument(
                this.collection,
                record,
                this.options,
                this.includeHiddenFields
            ) as TValue;
        }

        if (this.useLean) {
            return records.map((record) =>
                projectRecord(record, this.options, this.includeHiddenFields)
            ) as TValue;
        }

        return records.map((record) =>
            toDocument(this.collection, record, this.options, this.includeHiddenFields)
        ) as TValue;
    }

    exec(): Promise<TValue> {
        return Promise.resolve(this.resolve());
    }

    then<TResult1 = TValue, TResult2 = never>(
        onfulfilled?: ((value: TValue) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
    ): Promise<TResult1 | TResult2> {
        return this.exec().then(onfulfilled ?? undefined, onrejected ?? undefined);
    }

    catch<TResult = never>(
        onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
    ): Promise<TValue | TResult> {
        return this.exec().catch(onrejected ?? undefined);
    }

    finally(onfinally?: (() => void) | null): Promise<TValue> {
        return this.exec().finally(onfinally ?? undefined);
    }
}

export function createCollectionModel(
    collection: CollectionName,
    options: ModelOptions = {}
): JsonModel {
    const getCollectionState = (): StoredRecord[] => getState()[collection];

    return {
        find(filter?: QueryFilter) {
            const safeFilter = toQueryFilter(filter);
            return new JsonQuery(
                collection,
                options,
                () =>
                    getCollectionState()
                        .filter((entry) => matchesFilter(entry, safeFilter))
                        .map((entry) => deepClone(entry)),
                false
            );
        },

        findOne(filter?: QueryFilter) {
            const safeFilter = toQueryFilter(filter);
            return new JsonQuery(
                collection,
                options,
                () =>
                    getCollectionState()
                        .filter((entry) => matchesFilter(entry, safeFilter))
                        .map((entry) => deepClone(entry)),
                true
            );
        },

        findById(id: string) {
            return new JsonQuery(
                collection,
                options,
                () =>
                    getCollectionState()
                        .filter((entry) => entry._id === id)
                        .map((entry) => deepClone(entry)),
                true
            );
        },

        findByIdAndUpdate(id: string, update: QueryFilter) {
            const updated = mutateState((state) => {
                const collectionState = state[collection];
                const index = collectionState.findIndex((entry) => entry._id === id);
                if (index === -1) {
                    return null;
                }

                const next = applyUpdate(collectionState[index], update);
                collectionState[index] = next;
                return deepClone(next);
            });

            return new JsonQuery(
                collection,
                options,
                () => (updated ? [updated] : []),
                true
            );
        },

        findByIdAndDelete(id: string) {
            const deleted = mutateState((state) => {
                const collectionState = state[collection];
                const index = collectionState.findIndex((entry) => entry._id === id);
                if (index === -1) {
                    return null;
                }

                const [removed] = collectionState.splice(index, 1);
                return deepClone(removed);
            });

            return new JsonQuery(
                collection,
                options,
                () => (deleted ? [deleted] : []),
                true
            );
        },

        async countDocuments(filter?: QueryFilter) {
            const safeFilter = toQueryFilter(filter);
            return getCollectionState().filter((entry) => matchesFilter(entry, safeFilter)).length;
        },

        async create(payload: Record<string, unknown>) {
            const inserted = mutateState((state) => {
                const collectionState = state[collection];
                const record = normalizePayload(payload);
                collectionState.push(record);
                return deepClone(record);
            });

            return toDocument(collection, inserted, options, new Set<string>());
        },

        async insertMany(payload: Array<Record<string, unknown>>) {
            const inserted = mutateState((state) => {
                const collectionState = state[collection];
                const records = payload.map((entry) => normalizePayload(entry));
                collectionState.push(...records);
                return records.map((entry) => deepClone(entry));
            });

            return inserted.map((record) => toDocument(collection, record, options, new Set<string>()));
        },

        async deleteMany(filter?: QueryFilter) {
            const safeFilter = toQueryFilter(filter);
            const deletedCount = mutateState((state) => {
                const collectionState = state[collection];
                const before = collectionState.length;
                state[collection] = collectionState.filter(
                    (entry) => !matchesFilter(entry, safeFilter)
                );
                return before - state[collection].length;
            });

            return {
                acknowledged: true,
                deletedCount,
            };
        },

        async aggregate<T = unknown>(pipeline: Array<Record<string, unknown>>) {
            let current: Array<Record<string, unknown>> = getCollectionState().map((entry) =>
                deepClone(entry)
            );

            for (const stage of pipeline) {
                if (isPlainObject(stage.$group)) {
                    current = applyGroupStage(
                        current.map((entry) => normalizeRecord(entry)),
                        stage.$group
                    );
                }
            }

            return current as T[];
        },
    };
}

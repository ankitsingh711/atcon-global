import { createCollectionModel } from '@/lib/json-db';

const User = createCollectionModel('users', {
    hiddenFields: ['passwordHash'],
});

export default User;

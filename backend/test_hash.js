import bcrypt from 'bcryptjs';

const hash = '$2b$10$TbH/RUY2M4vgkCfQbnael.PslhY7DkjLDLCIUHpQsxGGH2zeDmXAK';
const password = 'password123';

async function testHash() {
    const isMatch = await bcrypt.compare(password, hash);
    console.log('Password Match for "password123":', isMatch);
}

testHash();

import crypto from 'crypto';

export const aes = (input) => {
  const cipher = crypto.createCipher(
    'aes-256-cbc',
    process.env.CRYPTO_SECRETKEY,
  );
  let c_input = cipher.update(input, 'utf8', 'base64');
  c_input += cipher.final('base64');
  return c_input;
};

export const deaes = (input) => {
  const decipher = crypto.createDecipher(
    'aes-256-cbc',
    process.env.CRYPTO_SECRETKEY,
  );
  let d_input = decipher.update(input, 'base64', 'utf8');
  d_input += decipher.final('utf8');
  return d_input;
};

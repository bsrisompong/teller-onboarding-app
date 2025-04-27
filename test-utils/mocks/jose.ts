const mockJose = {
  jwtVerify: jest.fn().mockResolvedValue({ payload: {} }),
  jwtDecrypt: jest.fn().mockResolvedValue({ payload: {} }),
  compactDecrypt: jest.fn().mockResolvedValue({ plaintext: Buffer.from('{}') }),
};

export default mockJose;

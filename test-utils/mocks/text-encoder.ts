class MockTextEncoder {
  encode(text: string): Uint8Array {
    return new Uint8Array(Buffer.from(text));
  }
}

export { MockTextEncoder as TextEncoder };

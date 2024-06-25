# CBE Verifier

`cbe-verifier` is a TypeScript library designed to verify transactions from the Commercial Bank of Ethiopia (CBE). This library provides functions to verify transaction details and detect transaction IDs from screenshots.

## Features

- **Transaction Verification**: Verify CBE transactions by providing a transaction ID, account number, and verification URL.
- **Transaction ID Detection**: Detect transaction IDs from screenshots, supporting both QR code scanning and text detection.

## Installation

Install the library using npm:

```bash
npm install @jvhaile/cbe-verifier
```

## Usage

### Transaction Verification

The `verify` function verifies CBE transactions.

#### Function Signature

```typescript
export async function verify(request: {
    transactionId: string,
    accountNumberOfSenderOrReceiver: string,
    cbeVerificationUrl: string,
}): Promise<Either<VerifyFailure, VerifySuccess>>
```

#### Return Types

```typescript
export type VerifyFailure =
    | { type: 'INVALID_TRANSACTION_ID' }
    | { type: 'INVALID_ACCOUNT_NO' }
    | { type: 'TRANSACTION_NOT_FOUND' }
    | { type: 'API_REQUEST_FAILED', message: string }

export type VerifySuccess = {
    fullText: string,
    amount?: number,
    payer?: string,
    receiver?: string,
    reference?: string,
    payerAccount?: string,
    receiverAccount?: string,
    reason?: string,
    date?: string,
}
```

#### Example Usage

```typescript
import { verify } from 'cbe-verifier';

const verificationResult = await verify({
    transactionId: '1234567890',
    accountNumberOfSenderOrReceiver: '0987654321',
    cbeVerificationUrl: 'https://cbe-verification-url.example.com'
});

if (verificationResult.isRight()) {
    console.log('Transaction verified:', verificationResult.value);
} else {
    console.error('Verification failed:', verificationResult.value);
}
```

### Transaction ID Detection

The `detectTransactionId` function detects transaction IDs from screenshots.

#### Function Signature

```typescript
export async function detectTransactionId(buffer: Buffer, params: {
    googleVisionAPIKey?: string,
}): Promise<DetectTransactionIdResult | null>
```

#### Return Type

```typescript
export type DetectTransactionIdResult = {
    value: string,
    detectedFrom: 'QR_CODE' | 'TEXT_RECOGNITION',
    timeTaken: number,
}
```

#### Example Usage

```typescript
import { detectTransactionId } from 'cbe-verifier';
import fs from 'fs';

const buffer = fs.readFileSync('path/to/screenshot.png');

const detectionResult = await detectTransactionId(buffer, {
    googleVisionAPIKey: 'YOUR_GOOGLE_VISION_API_KEY'
});

if (detectionResult) {
    console.log('Transaction ID detected:', detectionResult.value);
} else {
    console.error('Transaction ID detection failed');
}
```

## Proxy Setup for External Use

Since the verification URL only works within Ethiopia, users outside Ethiopia can set up a proxy server within Ethiopia to use this library.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or enhancements.

---

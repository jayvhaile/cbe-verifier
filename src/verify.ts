import {Either, Left, Right} from "purify-ts";
import axios, {AxiosError} from "axios";
import {readPdfText} from "pdf-text-reader";
import {processResultText, TransactionDetail} from "./process-text/process-text";


export async function verify(request: {
    transactionId: string,
    accountNumberOfSenderOrReceiver: string,
    cbeVerificationUrl: string,
}): Promise<Either<VerifyFailure, TransactionDetail>> {
    const txnIdValidation = Either
        .encase(() => validateTxnId(request.transactionId))
        .mapLeft(() => ({type: 'INVALID_TRANSACTION_ID' as const}))

    if (txnIdValidation.isLeft()) return Left(txnIdValidation.extract())
    const accNoValidation = Either
        .encase(() => validateAccNo(request.accountNumberOfSenderOrReceiver))
        .mapLeft(() => ({type: 'INVALID_ACCOUNT_NO' as const}))

    if (accNoValidation.isLeft()) return Left(accNoValidation.extract())

    const txnId = txnIdValidation.unsafeCoerce()
    const accNo = accNoValidation.unsafeCoerce()

    const id = `${txnId}${accNo.substring(5)}`

    try {
        const response = await axios.get(`${request.cbeVerificationUrl}/${id}`, {
            responseType: "blob",
            responseEncoding: "binary",
        });

        const pdfText: string = await readPdfText({data: response.data});

        return Right(processResultText(pdfText))
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response) {
                return Left({type: 'TRANSACTION_NOT_FOUND' as const})
            } else {
                return Left({type: 'API_REQUEST_FAILED' as const, message: error.message})
            }
        } else {
            return Left({type: 'API_REQUEST_FAILED' as const, message: `Unknown error: ${error}`})
        }
    }
}

const validateTxnId = (txnId: any): string => {
    if (!txnId) throw 'Error: txnId is required!'
    if (!/^FT\w{10}$/.test(txnId.toString())) throw 'Error: Invalid txnId!'
    return txnId.toString()
}

const validateAccNo = (accNo: any): string => {
    if (!accNo) throw 'Error: accNo is required!'
    if (!/^1000\d{9}$/.test(accNo.toString())) throw 'Error: Invalid accNo!'
    return accNo.toString()
}



export type VerifyFailure =
    | { type: 'INVALID_TRANSACTION_ID' }
    | { type: 'INVALID_ACCOUNT_NO' }
    | { type: 'TRANSACTION_NOT_FOUND' }
    | { type: 'API_REQUEST_FAILED', message: string }



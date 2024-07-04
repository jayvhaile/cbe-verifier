
export function processResultText(text: string): TransactionDetail {
    const extractValue = (regex: RegExp, txt: string) => regex.exec(txt)?.groups?.['value']
    const amount = [
        extractValue(/ETB(?<value>[\d,]+\.\d+)/, text),
        extractValue(/Amount (?<value>[\d,]+\.\d+) ETB/, text)
    ].find(it => it != undefined)
    const payer = extractValue(/Payer (?<value>\w+ \w+ \w+)/, text)
    const payerAccount = extractValue(/Payer \w+ \w+ \w+\s*Account (?<value>1\*+\d{3})/, text)
    const receiver = extractValue(/Receiver (?<value>\w+ \w+ \w+)/, text)
    const receiverAccount = extractValue(/Receiver \w+ \w+ \w+\s*Account (?<value>1\*+\d{3})/, text)
    const paymentDate = extractValue(/Payment Date \w+ (?<value>\w+ \w+ \w+)/, text)
    const reference = extractValue(/Reference No\. (?<value>FT\w{10})/, text)
    const reason = extractValue(/Reason (?<value>\w*)/, text)

    return {
        fullText: text,
        amount: amount ? Number.parseFloat(amount.replace(",","")) : undefined,
        payer,
        receiver,
        reference,
        payerAccount,
        receiverAccount,
        reason,
        date: paymentDate,
    }
}

export type TransactionDetail = {
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

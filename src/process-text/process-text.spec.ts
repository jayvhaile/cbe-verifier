import {processResultText} from "./process-text";

const tx_sample_1 = `Transferred Amount 3,500.00 ETB`

describe('process-text', () => {
    it('should extract amount properly', ()=>{
        const transactionDetail = processResultText(tx_sample_1)

        expect(transactionDetail.amount).toBe(3500)
    })
})
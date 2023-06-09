import { Router } from 'express';
import CartManager from '../Managers/CartManager.js';

const routerC = Router()

const cm = new CartManager()


routerC.get('/:cid', async (request, response) => {
    try {
        const { cid } = request.params

        if (isNaN(Number(cid))) {
            return response.status(400).send({ status: 'Error', message: 'Invalid identification' });
        }

        const result = await cm.getproductsById(Number(cid))

        if (result.status === 'error') return response.status(400).send({ result });

        return response.status(200).send({ result });
    } catch (err) {
        console.log(err);
    }

})



routerC.post('/', async (request, response) => {
    try {
        const products = request.body

        if (!Array.isArray(products)) return response.status(400).send({ status: 'error', message: 'TypeError' });

        if (products.length === 0) return response.status(400).send({ status: 'error', message: 'The products is empty' })

        const result = await cm.addCart(products)

        if (result.status === 'error') return response.status(400).send(result.message);

        return response.status(200).send(result.message);
    }
    catch (err) {
        console.log(err);
    }
})

routerC.post('/:cid/product/:pid', async (request, response) => {
    let { cid, pid } = request.params
    const {quantity} = request.body
    
    const result = await cm.addProductInCart(Number(cid), [{id:Number(pid), quantity}])
    return response.status(200).send(`${result.message} with ID: ${cid}`);
})

export default routerC;
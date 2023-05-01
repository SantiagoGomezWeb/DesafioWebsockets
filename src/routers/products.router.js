import { Router } from 'express';
import ProductManager from '../Managers/ProductManager.js';

const routerP = Router()

const pm = new ProductManager()


routerP.get('/', async (request, response) => {
    try {
        let { limit } = request.query
        const products = await pm.getProducts();

        if (!limit) return response.status(200).send({ products })

        if (isNaN(Number(limit))) return response.status(400).send({message: 'The limit is invalid' })
        limit = Number(limit)

        "Si el limit es menor a cero se devuelve un error"
        if (limit<0) return response.status(400).send({message: 'The limit cannot be less than 0'})
        if (products.length > limit) {
            const limitProduct = products.slice(0, limit)
            return response.status(200).send({ limit, products:limitProduct });
        }

        return response.status(200).send({ products });
    } catch (err) {
        console.log(err);
    }


})

routerP.get('/:pid', async (request, response) => {
    try {
        const { pid } = request.params

        if (isNaN(Number(pid))) {
            return response.status(400).send( {message: 'Invalid identification' });
        }

        const result = await pm.getProductById(pid)

        if (result.status === 'error') return response.status(400).send( result.message );

        return response.status(200).send( result );
    } catch (err) {
        console.log(err);
    }

})

routerP.post('/', async (request, response) => {
    try {
        const product = request.body
        const result = await pm.addProduct(product)
        if (result.status === 'error') return response.status(400).send( result.message );
        return response.status(201).send( {result: result.message, product} );
    }
    catch (err) {
        console.log(err);
    }
})

routerP.put('/:pid', async (request, response) => {
    try {
        const { pid } = request.params
        const product = request.body

        const result = await pm.updateProduct(Number(pid), product)

        if (result.status === 'error') return response.status(400).send({ result });
        return response.status(200).send( `${result.message} whit ID: ${pid}` )
    }
    catch (err) {
        console.log(err);
    }
    ;

})

routerP.delete('/:pid', async (request, response) => {
    try {
        const { pid } = request.params
        const result = await pm.deleteProduct(Number(pid))

        if (result.status === 'error') return response.status(400).send(result.message);
        return response.status(200).send(result.message);

    } catch (err) {
        console.log(err);
    }
})

export default routerP;
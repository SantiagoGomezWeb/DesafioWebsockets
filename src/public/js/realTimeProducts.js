const socket = io()
const products = document.getElementById('products');
const formulario = document.getElementById('form')


socket.on('products', data => {
    let productos = ''
    data.data.forEach(producto => {
        productos += `<div class="card text-white bg-success mb-3 mx-4 my-4" style="max-width: 20rem;">
                        <div class="card-header">Code: ${producto.code}</div>
                        <div class="card-body">
                            <h4 class="card-title">${producto.title}</h4>
                            <p class="card-text">
                                <li>
                                    id: ${producto.id}
                                </li>
                                <li>
                                    description: ${producto.description}
                                </li>
                                <li>
                                    price: $${producto.price}
                                </li>
                                <li>
                                    category: ${producto.category}
                                </li>
                                <li>
                                    status: ${producto.status}
                                </li>
                                <li>
                                    stock: ${producto.stock}
                                </li>
                                <li>
                                    thumbnail: ${producto.thumbnails}
                                </li>
                            </p>
                        </div>
                    </div>
                </div>`
    });
    products.innerHTML = productos
    
    
})


formulario.addEventListener('submit', (event) => {
    event.preventDefault()
    console.log(event.target);
    const data = Object.fromEntries(new FormData(event.target))
    data['status'] = new Boolean(data['status'])
    data['thumbnails'] = ['empty']
    data['price'] = Number(data['price'])
    data['stock'] = Number(data['stock'])

    socket.emit('product', data)

    socket.on('message', (res) => {
        if(res.status === 'error') {
            Swal.fire({
                icon: 'error',
                title: 'Ups! Error!',
                text: res.message,
                
              })
        }
        else{
            Swal.fire({
                icon: 'success',
                title: 'Added product',
                text: res.message,
                
              })
        }
    })
    formulario.reset()
})
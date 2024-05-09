
  const apiServer = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com/',
    timeout: 2000,
    headers: {'Content-Type': 'application/json'}
  });

  export const fetchData = async (category, id, nested) => {
    let path
    if( !id) {
        path = category
    } else {
        path = `${category}/${id}`
    }
    try {
        let response;
        
        if(nested) {
            response = await apiServer.get(`${path}/${nested}`)
        } else {
         response = await apiServer.get(`${path}`)
        }
        if(response.status !== 200) {
            throw new Error('Klaida, nepavyko gauti duomenų iš serverio. Bandykite dar kartą')
        }
        return response.data
        
    }catch(err) {
        alert(err)
    }
  }

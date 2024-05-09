import { fetchData} from "./fetch.script.js"
export const generateList = (parent, dataArray, category) => {
 
    dataArray.forEach(async (singleCard) => {
        const data = {}
        switch(category) {
            case 'users': 
            data.heading = singleCard.name
            data.details = [{title: 'El. Paštas', value: singleCard.email},{title: 'Slapyvardis', value: singleCard.username}]
            break;
            case 'posts':
            data.heading = singleCard.title
            data.details = [{title: 'Ištrauka', value: `${singleCard.body.slice(0, 70)}..`}]
            break;
            case 'albums': 
            data.heading = singleCard.title
            await fetchData(category, singleCard.id,'photos').then(resData => {data.img = resData[0]})
            await fetchData('users', singleCard.userId,).then(resData => {data.details = [{title: 'Autorius', value: resData.name}]})
            break;
        }

        const generatedCard = generateCard(data.heading, `${category}__card`, data.details, category, singleCard.id, data.img)
        
        parent.append(generatedCard)
    })
}



export const generateCard = (cardHeading, cardClass, cardData,category, id, img) => {
    const categorySingular = category.slice(0, -1);

    const cardElement = document.createElement('a')
    const headingElement = document.createElement('h4')

    let cardTitleAttr;
    if(category === 'posts') cardTitleAttr = 'įrašą'
    if(category === 'users') cardTitleAttr = 'vartotoją'
    if(category === 'albums') cardTitleAttr = 'albumą'

 
    cardElement.title = `Daugiau apie ${cardHeading} ${cardTitleAttr}`
    cardElement.href = `${categorySingular}.html?${categorySingular}=${id}`
    cardElement.classList.add(cardClass)
    cardElement.classList.add('card')
    headingElement.textContent = cardHeading

   
    if(category === 'albums') {
        const imgElement = document.createElement('img');
        imgElement.title = img.title
        imgElement.src = img.thumbnailUrl

        cardElement.append(imgElement)
    }

    cardElement.append(headingElement)
    if(cardData) {

        cardData.forEach((row) => {
            const detailElement = document.createElement('p')
            detailElement.textContent = `${row.title}: ${row.value}`
            cardElement.append(detailElement)
        })
    }

    return cardElement

}


export const generateUserPage = async (userData, parent) => {

    const userDetails = [{title: 'Slapyvardis', value: userData.username}, {title: 'El. Paštas', value: userData.email},
     {title: 'Telefonas', value: userData.phone}, {title: 'Svetainė', value: userData.website}]
     const userAddressDetails = [{title: 'Pilnas adresas', value: `${userData.address.city}, ${userData.address.street}, ${userData.address.suite}, ${userData.address.zipcode}`}, {title: 'Koordinatės', value: `${userData.address.geo.lat} ${userData.address.geo.lng}`}]
    const userCompanyDetails = [{title: 'Pavadinimas', value: userData.company.name}, {title: 'Frazė', value: userData.company.catchPhrase}, {title: 'Sritis', value: userData.company.bs}]

    let userPosts = []
    let userAlbums = []

    await fetchData('users',userData.id,'posts').then(resData => {userPosts = resData})
    await fetchData('users', userData.id, 'albums').then(resData => {userAlbums = resData})

    createBlockContent(userDetails,'user__user');
    createBlockContent(userAddressDetails, 'user__address')
    createBlockContent(userCompanyDetails, 'user__company')
    createPostsList(userPosts,'user__posts')
    createAlbumsList(userAlbums,'user__albums')
    
}

export const generatePostPage = async (postData) => {
    const authorResponse = await fetchData('users',postData.userId)
    const authorData = await authorResponse;
    const postDetails = [{title: 'Autorius', value: authorData.name}, {title: '', value: postData.body}]

    let postComments = []

    await fetchData('posts',postData.id,'comments').then(resData => {postComments = resData})

    createBlockContent(postDetails, 'post__post')
    createCommentsList(postComments,'post__comments')

}

export const generateAlbumPage = async (albumData) => {
    const authorResponse = await fetchData('users', albumData.userId)
    const authorData = await authorResponse;
    const albumDetails = [{title: 'Autorius', value: authorData.name}]

    let albumPhotos = []

    await fetchData('albums', albumData.id,'photos').then(resData => {albumPhotos = resData})

    createBlockContent(albumDetails,'album__album')
    createPhotosList(albumPhotos,'album__photos')
}

function createBlockContent(data, parentSelector) {
    const parentElement = document.querySelector(`.${parentSelector}`)

  data.forEach((data) => {
    const pElement = document.createElement('p')
    pElement.textContent = data.title ? `${data.title}: ${data.value}` : data.value
    parentElement.appendChild(pElement)
  })
}

// GENERATES POSTS LIST INSIDE USER PAGE
function createPostsList(posts, parentToAppendSelector) {
    const parentElement = document.querySelector(`.${parentToAppendSelector}`)

    posts.forEach((post) => {
        const generatedPostCard = generateCard(post.title, 'user__post',[],'posts',post.id)
        parentElement.append(generatedPostCard)

    })

}

// GENERATES ALBUMS LIST INSIDE USER PAGE
function createAlbumsList(albums, parentToAppendSelector) {
    const parentElement = document.querySelector(`.${parentToAppendSelector}`)

    albums.forEach(async (album) => {
        const photosResponse = await fetchData('albums',album.id,'photos')
        const singlePhoto = await photosResponse[0]
        const generatedPostCard = generateCard(album.title, 'user__title',[],'albums',album.id,singlePhoto )
        parentElement.append(generatedPostCard)

    })
}

function createCommentsList(comments, parentToAppendSelector) {
    const parentElement = document.querySelector(`.${parentToAppendSelector}`)
    

    comments.forEach(({name, body,email}) => {
       const commentEl = createComment(name, email, body)
       parentElement.append(commentEl)
    })

}

function createPhotosList(photos, parentToAppendSelector) {
    const parentElement = document.querySelector(`.${parentToAppendSelector}`)

    photos.forEach((photo) => {
        const photoEl = document.createElement('img')
        photoEl.title = photo.title
        photoEl.src = photo.url
        photoEl.classList.add('album__photo')

        parentElement.append(photoEl)
    })


}


function createComment(name, email, body) {
    const divElement = document.createElement('div');
    const pElementName = document.createElement('p')
    const pElementEmail = document.createElement('p')
    const pElementBody = document.createElement('p')

    
    divElement.classList.add('comment')
    
    pElementName.textContent = name;
    pElementEmail.textContent = email
    pElementBody.textContent = body

    divElement.append(pElementBody,pElementName,pElementEmail)
    return divElement

}
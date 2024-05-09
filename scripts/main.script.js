import {fetchData} from "./fetch.script.js"
import { generateAlbumPage, generateList, generatePostPage, generateUserPage } from "./generator.script.js";

// Gets path /users.html converts to users
const path = window.location.pathname.split('.')[0].slice(1)
const Categories = {
  USERS: 'users',
  POSTS: 'posts',
  ALBUMS: 'albums',
  USER: 'user',
  ALBUM: 'album',
  POST: 'post',
}

generatePageContent(path.toUpperCase())

  async function generatePageContent(page) {
    const contentElement = document.querySelector('.section__layout')
    const id = getId(path.toLowerCase())

    if(['USERS','POSTS','ALBUMS'].includes(page)) {
      const dataResponse = await fetchData(Categories[page])
      const data = await dataResponse
      generateList(contentElement,data,Categories[page])
      changePageSectionHeading(data.length)
    } else {
      const dataResponse = await fetchData(`${Categories[page]}s`,id)
      const data = await dataResponse;

      if(page === 'USER') generateUserPage(data,contentElement)
      if(page === 'POST') generatePostPage(data, contentElement)
      if(page === 'ALBUM') generateAlbumPage(data, contentElement)


      if(page === 'USER')changePageSectionHeading(data.name)
      if(page === 'POST' || page === 'ALBUM') changePageSectionHeading(data.title)
      
    }

  }



// If list page - adds number of records || single page - changes heading to name/title
function changePageSectionHeading(val) {
  const sectionHeading = document.querySelector('.section__heading')
  sectionHeading.textContent = typeof val === 'string' ? val : `${sectionHeading.textContent} (${val})`
}

function getId(paramToGet) {
  const searchParams = new URL(document.location).searchParams
  return searchParams.get(paramToGet)
}

// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

const quotesUL = document.getElementById('quote-list')
const quotesForm = document.querySelector("#new-quote-form")

fetch("http://localhost:3000/quotes?_embed=likes")
.then(res => res.json())
.then((quotesArr) => {
  quotesArr.forEach((quote) => {
    turnQuoteObjToHTML(quote)
  }) // End of .forEach
}) //End of the second .then

quotesForm.addEventListener("submit", (evt) => {
  evt.preventDefault()
  let newAuthor = evt.target["author"].value
  let newQuote = evt.target["new-quote"].value

  fetch(`http://localhost:3000/quotes`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json"
    },
    body: JSON.stringify({
      quote: newQuote,
      author: newAuthor
    })
  })
  .then(res => res.json())
  .then((quote) => {
    quote.likes = []
    turnQuoteObjToHTML(quote)
  })

})


function turnQuoteObjToHTML(quote){
  let quoteLi = document.createElement("li")
  quoteLi.className = "quote-card"

  quoteLi.innerHTML = `<blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
    <button class='btn-danger'>Delete</button>
  </blockquote>`

  quotesUL.append(quoteLi)

  let likeButton = quoteLi.querySelector(".btn-success")
  likeButton.addEventListener("click", (evt) => {
    // console.log(quoteLi, quote, evt.target);

    fetch(`http://localhost:3000/likes`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({
        quoteId: quote.id
      })
    }) //end of fetch
    .then(r => r.json())
    .then((likeObj) => {
      // Modifying the object in memory
      quote.likes.push(likeObj)
      // Manipulating the DOM
      let span = quoteLi.querySelector("span")
      span.innerText = quote.likes.length
    })


  }) // end of addEventListener


  let deleteButton = quoteLi.querySelector(".btn-danger")
  deleteButton.addEventListener("click", () => {

    fetch(`http://localhost:3000/quotes/${quote.id}`, {
      method: "DELETE"
    }) //End of Fetch
    .then(res => res.json())
    .then(() => {
      quoteLi.remove()
    })

  })

}

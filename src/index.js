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
    <button data-id="${quote.id}" class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
    <button data-id="${quote.id}" class='btn-danger'>Delete</button>
  </blockquote>`

  quotesUL.append(quoteLi)

}


quotesUL.addEventListener("click", (evt) => {
  if (evt.target.className === "btn-danger") {
    let id = evt.target.dataset.id
    fetch(`http://localhost:3000/quotes/${id}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(() => {
      evt.target.parentElement.parentElement.remove()
    })
  }
  if (evt.target.className === "btn-success") {
    let id = evt.target.dataset.id
    let span = evt.target.querySelector("span")
    let num = parseInt(span.innerText) + 1

    fetch(`http://localhost:3000/likes`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({
        quoteId: parseInt(id)
      })
    })
    .then(res => res.json())
    .then((newLike) => {
      span.innerText = num
    })

  }

})

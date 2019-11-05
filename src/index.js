let addToy = false

document.addEventListener("DOMContentLoaded", ()=>{
  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
    } else {
      toyForm.style.display = 'none'
    }
  })

  getToys(); // DRAW ALL TOYS TO PAGE PLZ!

  // begin ADD NEW TOY EventListener
  document.querySelector('.submit').addEventListener('click', event => {
	event.preventDefault();			// REMEMBER THIS FOR FUTURE SUCCESS!!!
	const newname = event.target.parentElement.name.value
	const newimage = event.target.parentElement.image.value
	fetch('http://localhost:3000/toys', {
		method: 'POST',
		headers: {
		    "Content-type": 'application/json',
		    "Accept": 'application/json'
		}, // end of headers
		body: JSON.stringify( {
		    "name": newname,
		    "image": newimage
		}) //end of body
	}).then(resp => resp.json())
	.then(json => {
		const toyContainer = document.querySelector('#toy-collection')
		newToy = document.createElement('div');
		newToy.className = "card"
		newToy.innerHTML = drawToy(json)
		toyContainer.appendChild(newToy)
	}) // end of fetch
  }) // end of ADD NEW TOY EventListener

  // begin LIKE BUTTON EventListener
  document.addEventListener('click', event => {
	if (event.target.innerText == "Like <3") {
		let toyLikes = parseInt(event.target.parentElement.querySelector('p').innerText.split(" ")[0])
		fetch(`http://localhost:3000/toys/${event.target.parentElement.id}`, {
			method: "PATCH",
			headers: {
			  "Content-type": 'application/json',
			  "Accept": 'application/json'
			}, // end of headers
			body: JSON.stringify( {
			  'likes': toyLikes + 1
			}) // end of body
		} // end of patch arguments
		).then(results => results.json())
		.then(json => {
			likesContainer = document.getElementById(json.id).querySelector('p');
			theSplit = likesContainer.innerHTML.split(' ');
			theSplit[0] = (parseInt(theSplit[0]) + 1).toString();
			likesContainer.innerHTML = theSplit.join(" ");
		}) // end of fetch
	} // end of IF EVENT IS LIKE BUTTON
  }) // end of LIKE BUTTON listener
}) // end of DOMContentLoaded

function drawToy(toy) {
	return `
	  <h2>${toy.name}</h2>
	  <img src=${toy.image} class="toy-avatar" />
	  <p>${toy.likes} Likes</p>
	  <button class="like-btn"> Like <3 </button>
	`
}

function getToys() {
	fetch('http://localhost:3000/toys')
	.then(resp => resp.json())
	.then(json => json.map(toy => {
		const toyContainer = document.querySelector('#toy-collection')  // find where all the toys go
		newToy = document.createElement('div');  			// a place for a single new toy
		newToy.className = "card"					// a way to locate that new place
		newToy.id = toy.id
		newToy.innerHTML = drawToy(toy)					// the innerHTML of the new toy
		toyContainer.appendChild(newToy)				// put the new toy where all the toys go
	}))
}


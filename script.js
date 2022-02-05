let cardsContainerElement = $("#my-cards-container");
let arrayOfItemsChecked = new Set();

$(() => {
	// getting the list of all coins
	const getAllCardsAsync = () => {
		$("#my-spinner").hide();
		$("#my-cards-container").hide();
		$("#about-container").hide();
		return new Promise((resolve, reject) => {
			$.ajax({
				url: "https://api.coingecko.com/api/v3/coins",
				success: (data) => {
					let strData = JSON.stringify(data);
					localStorage.setItem("Cards", strData);
					resolve(data);
				},
				error: (error) => {
					reject(error);
				},
			});
		});
	};

	//handles the toggle button so their won't be more then 5 toggles
	const handleToggleButton = () => {
		$(".checkbox-input").change(function (e) {
			e.preventDefault();
			$(".modal-body").empty(); //clear the modal from previous information
			let element = $(this).attr("id");
			console.log("element is: " + element);

			//Adding to the list
			if ($(this).prop("checked")) {
				console.log("if checked is true");
				if (arrayOfItemsChecked.size < 5) {
					arrayOfItemsChecked.add(element);
				} else {
					$(this).prop("checked", false);
					let arrayJS = Array.from(arrayOfItemsChecked);
					$("#myModal").modal("show");
					let i = 0;
					for (; i < arrayJS.length; i++) {
						$(".modal-body").append(`		
							<div class="custom-control custom-switch">
								<input type="checkbox" class="custom-control-input checkbox-input" id="modale-${arrayJS[i]}" checked>
								<label class="custom-control-label" for="modale-${arrayJS[i]}" >${arrayJS[i]}</label>
							</div>	
						`);
					}

					$("#modal-save-btn").click(function (e) {
						e.preventDefault();
						for (let j = 0; j < arrayJS.length; j++) {
							if (!$(`#modale-${arrayJS[j]}`).prop("checked")) {
								$(`#${arrayJS[j]}`).prop("checked", false);
								arrayOfItemsChecked.delete(arrayJS[j]);
							}
						}
						$("#myModal").modal("hide");
					});
				}
			} else {
				//if user unchecks a coin, delete it from the array
				arrayOfItemsChecked.delete(element);
				console.log("arrayOfItemsChecked (after filter) is: " + JSON.stringify(arrayOfItemsChecked));
			}
		});
	};

	const moreInfoFunction = () => {
		$(".more-info-btn").click(function () {
			$(this).next().collapse("toggle");
			if ($(this).next().children().length <= 0) {
				let cardId = $(this).attr("id");
				let coinsPrices;
				$.ajax({
					url: `https://api.coingecko.com/api/v3/coins/${cardId}`,
					async: false,
					success: function (data) {
						console.log("success");
						coinsPrices = {
							usd: `${data.market_data.current_price.usd}`,
							eur: `${data.market_data.current_price.eur}`,
							ils: `${data.market_data.current_price.ils}`,
							imgSrc: `${data.image.small}`,
						};
					},
				});

				$(this).next().append(`
					<div class="more-data-container">
						<p class="card-text prices">${coinsPrices.usd}$</p>
						<p class="card-text prices">${coinsPrices.eur}€</p>
						<p class="card-text prices">${coinsPrices.ils}₪</p>
						<img src="${coinsPrices.imgSrc}">
					</div>
				`);
			}
		});
	};

	//Dispalying all cards
	const displayAllCards = (cards) => {
		$("#my-cards-container").show();
		$("#my-spinner").hide();

		for (let index = 0; index < cards.length; index++) {
			console.log(index);
			if (cards[index].id === undefined) {
				break;
			}
			//console.log('for loop in display card function');
			console.log("the id is: " + cards[index].id);
			$("#my-spinner").hide();
			cardsContainerElement.append(`
				<div class="col parent-div">
					<div class="card" >
						<div class="card-body">
							<h5 class="card-title">${cards[index].symbol.toUpperCase()}</h5>
							<p class="card-text">${cards[index].name}</p>

							<div class="custom-control custom-switch">
								<input type="checkbox" class="custom-control-input checkbox-input" id="${cards[index].symbol.toUpperCase()}">
								<label class="custom-control-label" for="${cards[index].symbol.toUpperCase()}"></label>
							</div>

							<a  class="btn btn-primary more-info-btn" id="${cards[index].id}">More Info</a>
							<div id="more-info-cards-container">

							</div>                            
						</div>
					</div>
				</div>
			`);
		}
		moreInfoFunction();
		handleToggleButton(cards);
	};

	$("#coins-button").click(function () {
		$("#my-spinner").show();
	});

	// ---------------------------------------------------------------------------------------------------------------------------
	//      ---------------------------------------------------------------------------------------------------------------
	// Program starts here
	$("#my-spinner").show();
	$("#about-container").hide();

	getAllCardsAsync()
		.then((cards) => displayAllCards(cards))
		.catch((error) => console.log("the error is: " + error));

	//Go to about page (when About button is clicked)
	$("#about-btn").click(() => {
		$("#search-container").hide();
		$("#appbar").hide();
		$("#header").hide();
		$("#my-cards-container").hide();
		$("#about-container").show();
	});

	//Go to main page when pressing the 'coin' button in 'About' page
	$("#main-page").click(() => {
		$("#search-container").show();
		$("#appbar").show();
		$("#header").show();
		$("#my-cards-container").show();
		$("#about-container").hide();
	});

	//handle the search option
	$("#search-button").click(function (e) {
		//e.preventDefault()
		console.log("search button was clicled!");
		let value = $("#search-input").val().toLowerCase();
		if (value === "") {
			console.log("value is undefined. value returns: ");
			console.log(value);
			return;
		}
		$("#my-cards-container").empty();
		let cardsData = localStorage.getItem("Cards");
		let cardsObjectified = JSON.parse(cardsData);

		for (let i = 0; i < cardsObjectified.length; i++) {
			console.log("card data is: ");
			console.log(cardsObjectified[i]);
			//console.table(cardsObjectified[i]);
			if (cardsObjectified[i].id === value || cardsObjectified[i].symbol === value) {
				cardsContainerElement.append(`
                    <div id="${cardsObjectified[i].id}" class="col">
                        <div class="card" >
                            <div class="card-body">
                                <h5 class="card-title">${cardsObjectified[i].symbol.toUpperCase()}</h5>
                                <p class="card-text">${cardsObjectified[i].name}</p>

                                <div class="custom-control custom-switch">
                                    <input type="checkbox" class="custom-control-input" id="customSwitch${i}">
                                    <label class="custom-control-label" for="customSwitch${i}"></label>
                                </div>

                                <a id="more-info-btn"  class="btn btn-primary">More Info</a>
                                <div id="more-info-cards-container-${cardsObjectified[i].id}">

                                </div>

                            </div>
                        </div>
                    </div>
                    `);
			}
			moreInfoFunction();
			// if (value === null) {
			// 	getAllCardsAsync()
			// 		.then((cards) => displayAllCards(cards))
			// 		.catch((error) => console.log("the error is: " + error));
			// }
		}
	});

	// Refresh page when pressing 'coin' button (in main page)
	$("#coins-button").click(function () {
		location.reload();
	});
});

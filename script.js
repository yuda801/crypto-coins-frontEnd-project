let cardsContainerElement = $("#my-cards-container");
let arrayOfItemsChecked = new Set();

$(() => {
  //2 - getting the list of all coins
  const getAllCardsAsync = () => {
    $("#my-spinner").hide();
    $("#my-cards-container").hide();
    $("#about-container").hide();
    console.log("2");
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

  // ====================================================================
  // ===================================
  //     ================================
  const handleToggleButton = () => {
    $(".checkbox-input").change(function (e) {
      e.preventDefault();
      let element = $(this).attr("id");
      console.log("element is: " + element);

      //Adding to the list
      if ($(this).prop("checked")) {
        console.log("if checked is true");
        if (arrayOfItemsChecked.size < 5) {
          console.log("if size < 5");
          arrayOfItemsChecked.add(element);
          console.log("arrayOfItemsChecked is: " + arrayOfItemsChecked);
        } else {
          console.log("if size >= 5");
          $("#myModal").modal("show");
          $(this).prop("checked", false);
        }
      } else {
        console.log("if checked false");
        for (const item of arrayOfItemsChecked) {
          if (item === element) {
            arrayOfItemsChecked.delete(item);
            break;
          }
        }
        console.log(
          "arrayOfItemsChecked (after filter) is: " + arrayOfItemsChecked
        );
      }
    });
  };

  const moreInfoFunction = () => {
    $(".more-info-btn").click(function () {
      $(this).next().collapse("toggle");
      if ($(this).next().children().length <= 0) {
        let cardId = $(this).attr("id");
        console.log("card ID is:" + cardId);

        $.ajax({
          url: `https://api.coingecko.com/api/v3/coins/${cardId}`,
          success: function (data) {
            saveMoreInfoToLocalStorage(data);
          },
        });

        saveMoreInfoToLocalStorage = (data) => {
          console.log("saveMoreInfoToLocalStorage");
          let moreInfoObject = {
            usd: `${data.market_data.current_price.usd}`,
            eur: `${data.market_data.current_price.eur}`,
            ils: `${data.market_data.current_price.ils}`,
            imgSrc: `${data.image.small}`,
            symbol: `${data.symbol}`,
          };
          localStorage.setItem(
            `moreInfoObject${data.symbol}`,
            JSON.stringify(moreInfoObject)
          );
          setTimeout(() => {
            localStorage.removeItem(`moreInfoObject${data.symbol}`);
          }, 120000);
          appendDataContainer(data);
        };

        const appendDataContainer = (data) => {
          console.log("appendDataContainer");
          let moreInfoStringFromLocalStorage = localStorage.getItem(
            `moreInfoObject${data.symbol}`
          );
          moreInfoObjectFromLocalStorage = JSON.parse(
            moreInfoStringFromLocalStorage
          );

          let moreInfo = `
            <div class="more-data-container">
                    <p class="card-text prices">${moreInfoObjectFromLocalStorage.usd}$</p>
                    <p class="card-text prices">${moreInfoObjectFromLocalStorage.eur}€</p>
                    <p class="card-text prices">${moreInfoObjectFromLocalStorage.ils}₪</p>
                    <img src="${moreInfoObjectFromLocalStorage.imgSrc}" alt="${moreInfoObjectFromLocalStorage.symbol} img">
                </div>
            `;
          $(this).next().append(moreInfo);
        };
      } else {
        return;
      }
    });
  };

  //Dispalying wanted cards
  const displayAllCards = (cards) => {
    //console.log('cards is: ' + cards);

    $("#my-cards-container").show();
    $("#my-spinner").hide();

    for (let index = 0; index < cards.length; index++) {
      console.log(index);
      if (cards[index].id === undefined) {
        break;
      }
      //console.log('for loop in display card function');
      console.log("the id is: " + cards[index].id);
      cardsContainerElement.append(`
                <div class="col parent-div">
                    <div class="card" >
                        <div class="card-body">
                            <h5 class="card-title">${cards[
                              index
                            ].symbol.toUpperCase()}</h5>
                            <p class="card-text">${cards[index].name}</p>

                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input checkbox-input" id="customSwitch${index}">
                                <label class="custom-control-label" for="customSwitch${index}"></label>
                            </div>

                            <a  class="btn btn-primary more-info-btn" id="${
                              cards[index].id
                            }">More Info</a>
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
  //1 - Program starts here
  console.log("1");
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

  $("#search-button").click(function (e) {
    //e.preventDefault()
    $("#my-cards-container").empty();
    console.log("search button was clicled!");
    var value = $("#search-input").val().toLowerCase();
    let cardsData = localStorage.getItem("Cards");
    let cardsObjectified = JSON.parse(cardsData);
    //displayAllCards(cardsObjectified)
    // console.log(cardsObjectified);
    // console.table(cardsObjectified);
    //console.log(`cards data as recieved from local storage (console.log): ${cardsObjectified}`);
    //console.table('cards data as recieved from local storage (console.table): ' + cardsObjectified);

    //let cardsContainerElement = $("#my-cards-container")

    //console.log('dfgde');

    for (let i = 0; i < cardsObjectified.length; i++) {
      console.log("card data is: ");
      console.log(cardsObjectified[i]);
      //console.table(cardsObjectified[i]);
      if (
        cardsObjectified[i].id === value ||
        cardsObjectified[i].symbol === value
      ) {
        cardsContainerElement.append(`
                    <div id="${cardsObjectified[i].id}" class="col">
                        <div class="card" >
                            <div class="card-body">
                                <h5 class="card-title">${cardsObjectified[
                                  i
                                ].symbol.toUpperCase()}</h5>
                                <p class="card-text">${
                                  cardsObjectified[i].name
                                }</p>

                                <div class="custom-control custom-switch">
                                    <input type="checkbox" class="custom-control-input" id="customSwitch${i}">
                                    <label class="custom-control-label" for="customSwitch${i}"></label>
                                </div>

                                <a id="more-info-btn"  class="btn btn-primary">More Info</a>
                                <div id="more-info-cards-container-${
                                  cardsObjectified[i].id
                                }">

                                </div>

                            </div>
                        </div>
                    </div>
                    `);
      }
      moreInfoFunction();
    }
  });

  // Refresh page when pressing 'coin' button (in main page)
  $("#coins-button").click(function () {
    location.reload();
  });
});

// onclick = "moreInfoClicked(${cards[index].id})"

//$(`#more-info-cards-container`).append(`
//url: `https://api.coingecko.com/api/v3/search?query=${value}`,

//$(this).attr("id")

//Search when button is clicked
// $("#search-button").click(function(e) {
//     //e.preventDefault()
//     var value = $("#search-input").val();
//     console.log('value is: ' + value);
//     $("#my-cards-container").filter(function() {
//         $.ajax({
//             url: `https://api.coingecko.com/api/v3/coins${coins}`,
//             success: data => {
//                 $("#my-cards-container").html("");
//                 displayCards(data)
//                 $("#my-cards-container").show()

//             }
//         })

//     });

// });

// const getTwoMInuteTimer = () => {
//     let isOutOfTime = false;
//     setTimeout(function() {
//         isOutOfTime = true;
//         return isOutOfTime
//     }, 2000);
//     return isOutOfTime
// }

// const moreInfoClicked = (cardID) => {
//     $("#cardID").append(`
//         <div class="container">
//         <h2>Collapsible Panel</h2>
//         <p>Click on the collapsible panel to open and close it.</p>
//         <div class="panel-group">
//             <div class="panel panel-default">
//             <div class="panel-heading">
//                 <h4 class="panel-title">
//                 <a data-toggle="collapse" href="#collapse1">Collapsible panel</a>
//                 </h4>
//             </div>
//             <div id="collapse1" class="panel-collapse collapse">
//                 <div class="panel-body">Panel Body</div>
//                 <div class="panel-footer">Panel Footer</div>
//             </div>
//             </div>
//         </div>
//         </div>
//     `)
// }

// <div class="moreInfoContainer">
//     <h2>Collapsible Panel</h2>
//     <p>Click on the collapsible panel to open and close it.</p>
//     <div class="panel-group">
//         <div class="panel panel-default">

//             <div class="panel-heading">
//                 <h4 class="panel-title">
//                 <a data-toggle="collapse" href="#collapse1">Collapsible panel</a>
//                 </h4>
//             </div>

//             <div id="collapse1" class="panel-collapse collapse">
//                 <div class="panel-body">Panel Body</div>
//                 <div class="panel-footer">Panel Footer</div>
//             </div>

//         </div>
//     </div>
// </div>

// arrayOfItemsChecked.forEach((coin) => {
//   if (coin === element) {
//     isInTheList = true;
//     arrayOfItemsChecked.filter((item) => item !== element);
//   }
// });

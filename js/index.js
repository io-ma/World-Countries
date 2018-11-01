const Countries = {
  /**
   * Initiate Countries App
   */
  init() {
    this.bindEvents();
  },

  /**
   * Ajax loader
   * @param url {String}
   * @param type {String} default = json
   * @return {Promise}
   */
  load(url, type = 'json') {
    return $.ajax({
      dataType: type,
      url: url,
    });
  },

  /**
   * Load and generate countries data
   * @param continent {String}
   */
  getCountries(continent) {
    this.load(`https://restcountries.eu/rest/v2/region/${continent}`)
      .then((data) => {
        this.generateBlocks(data);
      });
  },

  /**
   * Select a random animation class for the block details
   * @return {String} Class name
   */
  randomAnimationClass() {
    const classes = ['-slide-right', '-slide-left', '-slide-up', '-slide-down'];
    return classes[Math.floor((Math.random() * 4))];
  },

  // Getting the details for the overlay block
  getDetails(block) {
    // Use this method to load your content from the selected APIs
    const countries = $('.countries');
    const name = block.find('h1').text();
    this.load(`https://restcountries.eu/rest/v2/name/${name}?fullText=true`)
      .then((data) => {
        data.forEach((ctry, index) => {
          let $list = block.find('.my-list');
          $list.find('.js-capital').text("Capital:" + " " + ctry.capital);
          $list.find('.js-population').text("Population:" + " " + ctry.population);
          $list.find('.js-people').text("People:" + " " + ctry.demonym);
          $list.find('.map').attr('href', `https://www.google.com/maps/place/${ctry.name}`).text('map');
        });
      });
  },

  /**
   * Generate html and append to DOM
   * @data {Array} as returned from the API
   */

  generateBlocks(data) {
    const tmpl = '<div class="countries__block js-block">' +
      '<img src="" />' +
      '<h1></h1>' +
      '<div class="countries__block-overlay">' +
      '<ul class="my-list">' + '<li class ="js-capital">' + '</li>' + '<li class ="js-population">' + '</li>' + '<li class ="js-people">' + '</li>' + '<li class="js-map">' + 'Open:' + ' ' + '<a class="map" href= "" target="_blank">' + '</a>' + '</li>' + '</ul>' +
      '</div>' +
      '</div>';
    const $cont = $('.countries');
    $cont.empty();
    // iterate countries
    data.forEach((country, index) => {
      let $block = $(tmpl);
      // hide block
      $block.find('.countries__block-overlay').hide();
      // Set country name
      $block.find('h1').text(country.name);
      // Add country flag image
      $block.find('img').attr('src', `http://www.geognos.com/api/en/countries/flag/${country.alpha2Code}.png`).on('error', (e) => {
        $block.remove();
      });
      this.load(`https://restcountries.eu/rest/v2/name/${country.name}?fullText=true`)
      .then((data) => {
        data.forEach((ctry, index) =>{
          let $list = $block.find('.my-list');
        });
      });
      $cont.append($block);
    }); // forEach ends here
    $('img').last().on('load', (e) => {
      $('.loader').removeClass('loading');
    });
  },

  /**
   * Menu Click handler
   * @param e {Event}
   */
  menuClicked(e) {
    const $elem = $(e.target);
    $('.loader').addClass('loading');
    this.getCountries($elem.text());
    $elem.addClass('active');
    e.preventDefault();
  },

  /**
   * Country block click handler
   * @param e {Event}
   */
  blockClicked(e) {
    const $block = $(e.target.closest('.js-block'));
    this.getDetails($block);
    $block.find('.countries__block-overlay').addClass(this.randomAnimationClass()).fadeIn(1000);
    $block.addClass('details-open');
    $block.prevAll().find('.countries__block-overlay').hide();
    $block.nextAll().find('.countries__block-overlay').hide();
    $block.prevAll().removeClass('details-open');
    $block.nextAll().removeClass('details-open');
  },

  /**
   * Bind events for our app
   */
  bindEvents() {
    $('.menu').on('click', 'a', this.menuClicked.bind(this));
    $('.countries').on('click', '.js-block', this.blockClicked.bind(this));
  }

};

// Initiate App
Countries.init();
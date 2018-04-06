class Movies {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.hannibalUrl = 'ec2-54-173-36-127.compute-1.amazonaws.com';
  }

  async configuration(key) {
    if (!this._configuration) {
      this._configuration = await this.fetch('configuration');
    }
    return this._configuration[key];
  }

  async search(title, cache) {
    const matchingKeys = Object.keys(cache).filter((key) => {
      return title.includes(key);
    });
    console.log(title);
    console.log(Object.keys(cache));
    let hannibal;
    if (matchingKeys.length > 0) {
      console.log('Searching from cache - yay!');
      hannibal = this.searchCache(title, cache, matchingKeys);
    } else {
      console.log('Querying DB - boo');
      hannibal = await this.fetchHannibal(title);
    }
    return hannibal.map((movie) => ({
      id: movie.IMDbId,
      title: movie.simpleTitle,
      year: String(movie.release_year),
      image: 'http://weknowyourdreams.com/images/dog/dog-13.jpg',
    }));
  }

  searchCache(searchTerm, cache, keys) {
    const longestKeyMatch = keys.reduce((a, b) => {
      return a.length > b.length ? a : b;
    });
    console.log(longestKeyMatch);
    function filterCache(searchTerm) {
      return (result) => {
        return result.title.toLowerCase().includes(searchTerm);
      };
    }
    // const searchResult = cache[longestKeyMatch].filter((result) => {
    //   return result.title.toLowerCase().includes(longestKeyMatch.toLowerCase());
    // });
    const searchResult = cache[longestKeyMatch].filter(filterCache(searchTerm));
    return searchResult;
  }

  async getImage(title, year) {
    const data = await this.fetch('search/movie', { page: 1, query: title, year });
    const configuration = await this.configuration('images');
    const image_path = `${configuration.base_url}w300${data.results[0].poster_path}`;
    return image_path;
  }

  async fetch(action, parameters = {}) {
    return fetch(this.url(action, parameters)).then((response) => response.json());
  }

  async fetchHannibal(title) {
    return fetch(`http://${this.hannibalUrl}:5000/movies?query=${title}`).then((response) => response.json());
  }

  async addMovies(movie1, movie2) {
    console.log(movie1, 'plus', movie2);
    return fetch(`http://${this.hannibalUrl}:5000/add?movie_imdb_1=${movie1}&movie_imdb_2=${movie2}`).then((response) =>
      response.json()
    );
  }

  async subtractMovies(movie1, movie2) {
    console.log(movie1, 'minus', movie2);
    console.log(this);
    return fetch(`http://${this.hannibalUrl}:5000/subtract?movie_imdb_1=${movie1}&movie_imdb_2=${movie2}`).then(
      (response) => response.json()
    );
  }

  async getByImdbId(id) {
    return this.fetch(`find/${id}`, { external_source: 'imdb_id' }).then((result) => result.movie_results[0]);
  }

  url(action, parameters = {}) {
    var url = `https://api.themoviedb.org/3/${action}?language=en-US&api_key=${this.apiKey}`;
    for (var key in parameters) {
      url += `&${key}=${encodeURIComponent(parameters[key])}`;
    }
    return url;
  }
}

export default new Movies(process.env.REACT_APP_TMDB_KEY);

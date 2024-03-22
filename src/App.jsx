import React, { useState, useEffect } from 'react';

const CLIENT_ID = "1e9c8649e20449fa9c78d07edefa998d";
const CLIENT_SECRET = "e18fba6ccbdc4048aaa6a41ab5087392";

const App = () => {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // API Access Token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
      .catch(error => console.error('Error fetching access token:', error));
  }, []);

  // Search
  async function search() {
    console.log("Search for " + searchInput);

    // Artist
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    try {
      var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
        .then(response => response.json())
        .then(data => data.artists.items[0].id);

      console.log("Artist ID is " + artistID);

      // Fetch albums
      var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setAlbums(data.items);
        });
    } catch (error) {
      console.error('Error fetching artist/albums:', error);
    }
  }

  return (
    <div className='bg-gray-900'>
      <div className='pt-10 flex justify-center gap-1'>
        <label className="input input-bordered w-[600px] flex items-center gap-2">
          <input type="text" className="grow" placeholder="Search" onKeyPress={e => {
            if (e.key === "Enter") {
              search();
            }
          }}
            onChange={e => setSearchInput(e.target.value)} />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
          </svg>
        </label>
        <button className="btn btn-neutral bg-gray-700" onClick={search}>Search</button>
      </div>

      {/* Cards */}
      <div className='grid grid-cols-4 gap-4 mx-24 pt-32'>
        {albums.map((album, i) => {
          return (
            <div key={i} className="card card-compact w-96 bg-base-100 shadow-xl">
              <figure><img src={album.images[0].url} alt={album.name} /></figure>
              <div className="card-body">
                <h2 className="card-title">{album.name}</h2>
                <p>{album.release_date}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary bg-gray-800 border-none">Listen Now</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate hook'u eklendi
import './Search.css';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [lyrics, setLyrics] = useState("");
  const [pagination, setPagination] = useState({ prev: null, next: null });
  const navigate = useNavigate(); // useNavigate tanımlandı

  const apiURL = "https://api.lyrics.ovh";

  // Şarkı arama fonksiyonu
  const searchSongs = async (term) => {
    try {
      const res = await fetch(`${apiURL}/suggest/${term}`);
      const data = await res.json();
      showData(data);
    } catch (error) {
      console.error("Error fetching songs:", error);
      showAlert("Error fetching songs");
    }
  };

  // Şarkı sözleri getirme fonksiyonu
  const getLyrics = async (artist, songTitle) => {
    try {
      const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
      const data = await res.json();
      if (data.error) {
        showAlert(data.error);
      } else {
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
        setLyrics(`
          <h2><strong>${artist}</strong> - ${songTitle}</h2>
          <span>${lyrics}</span>
        `);
      }
      setPagination({ prev: null, next: null });
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      showAlert("Error fetching lyrics");
    }
  };

  // Diğer şarkıları getirme fonksiyonu
  const getMoreSongs = async (url) => {
    try {
      const res = await fetch(`https://cors-anywhere.herokruapp.com/${url}`);
      const data = await res.json();
      showData(data);
    } catch (error) {
      console.error("Error fetching more songs:", error);
      showAlert("Error fetching more songs");
    }
  };

//   Şarkı listesini ve sayfalama verilerini işleme
  const showData = (data)=>{
    setResults(data.data);
    setPagination( { prev:data.prev,next:data.next });
  }


// Bildirim mesajı gösterme
const showAlert = (message) =>{
    const notif = document.createElement("div");
    notif.classList.add("toast");
    notif.innerText=message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(),3000);
}

// Form Gönderimini İşleme
const handleSubmit=(e)=>{
    e.preventDefault();
    if(!searchTerm.trim()){
        showAlert("Please Type in a search term")
    }else{
        searchSongs(searchTerm.trim());
    }

}

// Bileşen ilk yüklendiği anda bir varsayılan arama sonucu getir.

useEffect(()=>{
    searchSongs("lose");
},[])







  return (
    <div>
        {/* Anasayfaya döndürme butonu */}
        <button onClick={()=>navigate("/")}>HomePage</button>
        <form onSubmit={handleSubmit}>
            <input 
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for songs..."
            />
            <button type="submit">Search</button>
        </form>

        <div id="result">
            {lyrics ? (
                <div dangerouslySetInnerHTML={{ __html: lyrics}} />
            ) :(
                <ul className="songs">
                    {results.map((song) =>(
                        <li key={song.id}>
                            <span>
                                <strong>{song.artist.name}</strong> - {song.title}
                            </span>
                        <button
                        className="btn"
                        onClick={()=>getLyrics(song.artist.name,song.title)}
                        >
                            Get Lyrics
                        </button>
                        </li>
                    ))}
                </ul>
            ) }
        </div>

        <div id="more">
            {pagination.prev && (
                <button className="btn" onClick={()=>getMoreSongs(pagination.prev)} >
                    Prev
                </button>
            )}
            {pagination.next && (
                <button className="btn" onClick={() => getMoreSongs(pagination.next)}>
                    Next
                </button>
            )}
        </div>







    </div>
  );
};

export default Search;

















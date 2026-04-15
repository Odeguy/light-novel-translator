import { use, useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link, useParams, useLocation, useNavigate } from 'react-router-dom'

function App() {
  
  const [novels] = useState([])

  return (
    <BrowserRouter>
      <title>Light Novel Translator</title>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <header>
          <h1>Light Novel Translator</h1>
        </header>
      </Link>

      <Routes>
        <Route path="/" element={<Home novels={novels} />} />
        <Route path="/novel/:index" element={<NovelPage />} />
        <Route path="/novel/:index/chapter/:chapter" element={<ChapterPage />} />
      </Routes>

      <menu>
        
      </menu>
    </BrowserRouter> 
  )
}

function Home({ novels }) {
  
  const [menu_visible, setMenuVisible] = useState(false)
  const novel_menu = createNovel(setMenuVisible, novels)
  const [search_term, setSearchTerm] = useState("")

  return (
    <>
      {menu_visible ? novel_menu : null}
      <library>
        {novels.filter((novel) => novel.title.toLowerCase()
          .includes(search_term.toLowerCase()))
          .map((novel) => Novel_Button(novel))
        }
        <new_series_button>
          <button onClick={() => (setMenuVisible(true))}>
            <h3>New Series</h3>
          </button>
        </new_series_button>
      </library>
    </>
  )
}

function NovelPage() {

  const [menu_visible, setMenuVisible] = useState(false)
  const translate_menu = Translate_Menu(setMenuVisible)
  const { id } = useParams()
  const location = useLocation()
  const novel = location.state.novel
  const chapters = novel?.chapters

  return (
    <novel_page>
      <h1>{novel?.title}</h1>
      <image src={novel?.thumbnail} alt={novel?.title} />
      {menu_visible ? translate_menu : null}
      <chapters>
        {chapters.map((chapter, index) => Chapter_Button(chapter, novel, index))}
      </chapters>

      <translate_button>
        <button onClick={() => setMenuVisible(!menu_visible)}>
          <p>Translate New Chapters</p>
        </button>
      </translate_button>
    </novel_page>
  )
}

class Novel{
  thumbnail
  title
  id
  chapters

  constructor(thumbnail, title) {
    this.thumbnail = thumbnail
    this.title = title
    this.id = Math.random().toString(36).substring(2, 9)
    this.chapters = ["Chapter 1: Everyone Dies", "Chapter 2: Everyone's Back!"]
  }

}

function Novel_Button(Novel) {
  return (
    <novel_button>
      <Link to={`/novel/${Novel.id}`} state={{ novel: Novel }}>
        <img src={Novel.thumbnail} alt={Novel.title} />
        <p>{Novel.title}</p>
      </Link>
    </novel_button>
  )
}

function Chapter_Button(chapter, novel, index) {
  return (
    <Link to={`/novel/${novel.id}/chapter/${index + 1}`} state={{ chapter: chapter }}>
      <chapter_button>
        <p>{index}</p>
      </chapter_button>
    </Link>
  )
}

function ChapterPage() {

  const location = useLocation()
  const text = location.state.chapter

  return (
    <chapter_page>
    <p>
      {text || "No Text"}
    </p>
    </chapter_page>
  )

}

function Translate_Menu(hide_func) {

  const [model, setModel] = useState("")
  const [api_key, setApiKey] = useState("")
  const [original_language, setOriginalLanguage] = useState("")
  const [target_language, setTargetLanguage] = useState("")
  const [extra_details, setExtraDetails] = useState("")
  const [file, setFile] = useState(null)

  return (
    <translate_menu>
      <button id='exit'onClick={() => hide_func(false)}>X</button>
      <div class='row'>
        <h3>File:</h3>
        <select onChange={(e) => setFile(e.target.value)}>
          <option value="pdf">PDF</option>
          <option value="epub">EPUB</option>
          <option value="txt">TXT</option>
        </select>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <div class='row'>
        <h3>Model:</h3>
        <select onChange={(e) => setModel(e.target.value)}>
          <option value="google">Google Translate</option>
          <option value="deepl">DeepL</option>
          <option value="bing">Bing Translator</option>
        </select>
        <input type="search" placeholder='API Key...(unecessary for google translate)' onInput={(e) => setApiKey(e.target.value)} />
      </div>
      <div class='row'>
        <h3>Languages:</h3>
        <input type="search" placeholder='Original Language' onInput={(e) => setOriginalLanguage(e.target.value)} />
        <input type="search" placeholder='Target Language' onInput={(e) => setTargetLanguage(e.target.value)} />
      </div>
      <div class='row' id='extra'>
        <h3>Extra Details:{extra_details}{api_key}{original_language}{target_language}</h3>
        <textarea placeholder='Things to improve consistency, such as names, pronouns, the premise, etc.' onChange={(e) => setExtraDetails(e.target.value)} />
      </div>
      <button id='submit' onClick={() => Translate(file, model, api_key, original_language, target_language, extra_details)}>Submit</button>

    </translate_menu>
  )
}

function createNovel(hide_func, novels) {
  
  const [image, setImage] = useState("ln-translator/src/assets/blank.png")
  const [title, setTitle] = useState("")

  return (
    <new_novel_menu>
      <button id='exit'onClick={() => hide_func(false)}>X</button>
      <div class='row'>
        <h3>Title:</h3>
        <input type="text" accept="image/*" placeholder='Novel Title' onInput={(e) => setTitle(e.target.value)} />
      </div>
      <div class='row'>
        <h3>Thumbnail:</h3>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      </div>
      <button id='submit' onClick={() => {
        novels.push(new Novel(URL.createObjectURL(image), title));
        hide_func(false);
      }}>Submit</button>

    </new_novel_menu>
  )
}

async function Translate(file, model, api_key, original_language, target_language, extra_details) {
  const translation = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "file": file,
      "model": model,
      "api_key": api_key,
      "original_language": original_language,
      "target_language": target_language,
      "extra_details": extra_details
    })
  })

  new Novel(
    null,
    "Translated Novel"
  )
}



export default App


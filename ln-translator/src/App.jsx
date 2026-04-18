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
  const { id } = useParams()
  const location = useLocation()
  const novel = location.state.novel
  const chapters = novel?.chapters
  const translate_menu = Translate_Menu(setMenuVisible, novel)

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
    <Link to={`/novel/${novel.id}/chapter/${index + 1}`} state={{ chapter: chapter, novel : novel }}>
      <chapter_button>
        <p>{index + 1}</p>
      </chapter_button>
    </Link>
  )
}

function ChapterPage() {

  const location = useLocation()
  const text = location.state.chapter
  const novel = location.state.novel

  return (
    <chapter_page>
      <p>
        {text || "No Text"}
      </p>
      <Link to={`/novel/${novel.id}`} state={{ novel: novel}}>
        <back_to_series>
          Back to Series Page
        </back_to_series>
      </Link>
    </chapter_page>
  )

}

function Translate_Menu(hide_func, novel) {

  const [model, setModel] = useState("google")
  const [api_key, setApiKey] = useState("")
  const [target_language, setTargetLanguage] = useState("en-US")
  const [extra_details, setExtraDetails] = useState("")
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState("txt")
  const languages = [
    { label: "Afrikaans", code: "af" },
    { label: "Albanian", code: "sq" },
    { label: "Amharic", code: "am" },
    { label: "Arabic (Saudi Arabia)", code: "ar-SA" },
    { label: "Arabic", code: "ar" },
    { label: "Armenian", code: "hy" },
    { label: "Azerbaijani", code: "az" },
    { label: "Basque", code: "eu" },
    { label: "Belarusian", code: "be" },
    { label: "Bengali (India)", code: "bn-IN" },
    { label: "Bengali", code: "bn" },
    { label: "Bosnian (Cyrillic)", code: "bs-Cyrl" },
    { label: "Bosnian", code: "bs" },
    { label: "Bulgarian", code: "bg" },
    { label: "Burmese", code: "my" },
    { label: "Catalan", code: "ca" },
    { label: "Chinese (China)", code: "zh-CN" },
    { label: "Chinese (Hong Kong)", code: "zh-HK" },
    { label: "Chinese (Simplified)", code: "zh-Hans" },
    { label: "Chinese (Taiwan)", code: "zh-TW" },
    { label: "Chinese (Traditional)", code: "zh-Hant" },
    { label: "Chinese", code: "zh" },
    { label: "Croatian", code: "hr" },
    { label: "Czech", code: "cs" },
    { label: "Danish", code: "da" },
    { label: "Dutch (Belgium)", code: "nl-BE" },
    { label: "Dutch", code: "nl" },
    { label: "English (Australia)", code: "en-AU" },
    { label: "English (Canada)", code: "en-CA" },
    { label: "English (New Zealand)", code: "en-NZ" },
    { label: "English (Philippines)", code: "en-PH" },
    { label: "English (South Africa)", code: "en-ZA" },
    { label: "English (United Kingdom)", code: "en-GB" },
    { label: "English (United States)", code: "en-US" },
    { label: "English", code: "en" },
    { label: "Estonian", code: "et" },
    { label: "Filipino", code: "fil" },
    { label: "Finnish", code: "fi" },
    { label: "French (Canada)", code: "fr-CA" },
    { label: "French (Switzerland)", code: "fr-CH" },
    { label: "French", code: "fr" },
    { label: "Frisian", code: "fy" },
    { label: "Galician", code: "gl" },
    { label: "Georgian", code: "ka" },
    { label: "German", code: "de" },
    { label: "Greek", code: "el" },
    { label: "Guarani", code: "gn" },
    { label: "Gujarati", code: "gu" },
    { label: "Hausa", code: "ha" },
    { label: "Hebrew", code: "he" },
    { label: "Hebrew (iw)", code: "iw" },
    { label: "Hindi", code: "hi" },
    { label: "Hungarian", code: "hu" },
    { label: "Icelandic", code: "is" },
    { label: "Igbo", code: "ig" },
    { label: "Indonesian", code: "id" },
    { label: "Irish", code: "ga" },
    { label: "Italian", code: "it" },
    { label: "Japanese", code: "ja" },
    { label: "Kannada", code: "kn" },
    { label: "Khmer", code: "km" },
    { label: "Korean", code: "ko" },
    { label: "Kyrgyz", code: "ky" },
    { label: "Lao", code: "lo" },
    { label: "Latvian", code: "lv" },
    { label: "Lingala", code: "ln" },
    { label: "Lithuanian", code: "lt" },
    { label: "Luxembourgish", code: "lb" },
    { label: "Macedonian", code: "mk" },
    { label: "Malay", code: "ms" },
    { label: "Malayalam", code: "ml" },
    { label: "Maltese", code: "mt" },
    { label: "Marathi", code: "mr" },
    { label: "Mongolian", code: "mn" },
    { label: "Nepali", code: "ne" },
    { label: "Norwegian Bokmal", code: "nb" },
    { label: "Norwegian", code: "no" },
    { label: "Odia", code: "or" },
    { label: "Persian", code: "fa" },
    { label: "Polish", code: "pl" },
    { label: "Portuguese (Brazil)", code: "pt-BR" },
    { label: "Portuguese (Portugal)", code: "pt-PT" },
    { label: "Portuguese", code: "pt" },
    { label: "Punjabi (Pakistan)", code: "pa-PK" },
    { label: "Punjabi", code: "pa" },
    { label: "Romanian", code: "ro" },
    { label: "Russian", code: "ru" },
    { label: "Scots Gaelic", code: "gd" },
    { label: "Serbian", code: "sr" },
    { label: "Slovak", code: "sk" },
    { label: "Slovenian", code: "sl" },
    { label: "Somali", code: "so" },
    { label: "Spanish (Argentina)", code: "es-AR" },
    { label: "Spanish (Chile)", code: "es-CL" },
    { label: "Spanish (Colombia)", code: "es-CO" },
    { label: "Spanish (Costa Rica)", code: "es-CR" },
    { label: "Spanish (Ecuador)", code: "es-EC" },
    { label: "Spanish (El Salvador)", code: "es-SV" },
    { label: "Spanish (Guatemala)", code: "es-GT" },
    { label: "Spanish (Haiti)", code: "es-HT" },
    { label: "Spanish (Honduras)", code: "es-HN" },
    { label: "Spanish (Latin America)", code: "es-419" },
    { label: "Spanish (Mexico)", code: "es-MX" },
    { label: "Spanish (Nicaragua)", code: "es-NI" },
    { label: "Spanish (Panama)", code: "es-PA" },
    { label: "Spanish (Paraguay)", code: "es-PY" },
    { label: "Spanish (Peru)", code: "es-PE" },
    { label: "Spanish (Puerto Rico)", code: "es-PR" },
    { label: "Spanish (Spain)", code: "es-ES" },
    { label: "Spanish (United States)", code: "es-US" },
    { label: "Spanish (Uruguay)", code: "es-UY" },
    { label: "Spanish (Venezuela)", code: "es-VE" },
    { label: "Spanish", code: "es" },
    { label: "Swahili", code: "sw" },
    { label: "Swedish", code: "sv" },
    { label: "Tagalog", code: "tl" },
    { label: "Tajik", code: "tg" },
    { label: "Tamil", code: "ta" },
    { label: "Telugu", code: "te" },
    { label: "Thai", code: "th" },
    { label: "Turkish", code: "tr" },
    { label: "Ukrainian", code: "uk" },
    { label: "Urdu", code: "ur" },
    { label: "Uzbek", code: "uz" },
    { label: "Vietnamese", code: "vi" },
    { label: "Welsh", code: "cy" },
    { label: "Zulu", code: "zu" }
  ]

  return (
    <translate_menu>
      <button id='exit'onClick={() => hide_func(false)}>X</button>
      <div class='row'>
        <h3>File:</h3>
        <select onChange={(e) => setFileType(e.target.value)}>
          <option value="txt">TXT</option>
          <option value="pdf">PDF--doesn't work yet</option>
          <option value="epub">EPUB</option>
        </select>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <div class='row'>
        <h3>Model:</h3>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="google">Google Translate</option>
          <option value="tencent_hy">Tencent HY</option>
        </select>
        <input type="search" placeholder='API Key...(unecessary for google translate)' onInput={(e) => setApiKey(e.target.value)} />
        <button onClick={() => open("https://huggingface.co/settings/tokens")}>Get API Key</button>
      </div>
      <div class='row'>
        <h3>Languages:</h3>
        <select value={target_language} onChange={(e) => setTargetLanguage(e.target.value)}>
          {languages.map((language) => language_option(language))}
        </select>
      </div>
      <div class='row' id='extra'>
        <h3>Extra Details:</h3>
        <textarea placeholder='Things to improve consistency, such as names, pronouns, the premise, etc.' onChange={(e) => setExtraDetails(e.target.value)} />
      </div>
      <button id='submit' onClick={async () => {
        const result = await Translate(file, model, api_key, target_language, extra_details)
        novel.chapters.push(result)
      }}>Submit</button>

    </translate_menu>
  )
}

function language_option(language) {
  return (
    <>
      <option value={language.code}>{language.label}</option>
    </>
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

async function Translate(file, model, api_key, target_language, extra_details) {
  // Validation before sending
  if (!file) {
    alert("Please select a file")
    throw new Error("No file selected")
  }
  if (!model) {
    alert("Please select a model")
    throw new Error("No model selected")
  }
  if (!target_language) {
    alert("Please enter target language")
    throw new Error("No target language")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("model", model)
  if (api_key) formData.append("api_key", api_key)
  formData.append("target_language", target_language)
  formData.append("extra_details", extra_details || "")
  
  const response = await fetch("http://localhost:8000/chat", {
    method: "POST",
    body: formData
  })
  
  if (!response.ok) {
    const err = await response.json()
    console.error(err)
    throw new Error("Request failed")
  }

  const data = await response.json()
  alert(data.translation)
  return data.translation
}



export default App


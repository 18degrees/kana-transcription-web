import { useState, useEffect, useRef } from 'react'
import { Triangle } from './components/Triangle'
import { Arrow } from './components/Arrow'
import { fromKana, toKana, convertKana } from 'kana-transformer'
import packageJSON from '../package.json'

type operationType = 'transcribe kana' | 'transform to kana' | 'convert kana'

type kanaType = 'hiragana' | 'katakana'
type language = 'English' | 'Russian'

type systemsRU = 'polivanov' | 'nonstandard-ru' | 'static-ru'
type systemsEN = 'hepburn' | 'kunrei-shiki' | 'nihon-shiki'
type systems = systemsEN | systemsRU

function App() {
	const libVersion = useRef(packageJSON.dependencies['kana-transformer'].slice(1))

	const [operation, setOperation] = useState<operationType>('transcribe kana')

	const [kana, setKana] = useState<kanaType>('hiragana')
	const [language, setLanguage] = useState<language>('English')
	const [system, setSystem] = useState<systems>('hepburn')
	const [guess, setGuess] = useState<boolean>(false)

	const [input, setInput] = useState('')
	const [result, setResult] = useState('')

	function toggleMenu(className: string) {
		const menuElem = document.querySelector(`.${className}`)!

		if (!menuElem.classList.contains('active')) closeOtherMenus() 

		menuElem.classList.toggle('active')
	}

	function closeOtherMenus() {
		const optionMenus = document.querySelectorAll('.option')

		optionMenus.forEach(menu => {
			menu.classList.remove('active')
		})
	}

	useEffect(() => {
		closeMenu('option.operation')

		correctList()

		function correctList() {
			const listBtns = document.querySelectorAll(`.option.operation li`)

			listBtns.forEach(btn => {
				const btnType = btn.classList.value.split(' ')[0]

				if (btnType === operation.split(' ')[0]) {
					btn.classList.add('active')
				} else {
					btn.classList.remove('active')
				}
			})
		}
	}, [operation])

	useEffect(() => {
		setResult(() => {
			return (
				operation === 'transcribe kana' ? fromKana(input, system) :
				operation === 'transform to kana' ? toKana(input, {
					system,
					guess,
					toKana: kana
				}) :
				operation === 'convert kana' ? convertKana(input, kana) : ''
			)
		})
		
	}, [input, operation, guess, kana, system])

	useEffect(() => {
		closeMenu('option.kana')
		
		correctList()
		
		function correctList() {
			const listBtns = document.querySelectorAll(`.option.kana li`)
			
			listBtns.forEach(btn => {
				const btnType = btn.classList.value.split(' ')[0]
				
				if (btnType === kana) {
					btn.classList.add('active')
				} else {
					btn.classList.remove('active')
				}
			})
		}
	}, [kana])

	useEffect(() => {
		closeMenu('option.language')

		correctList()

		function correctList() {
			const listBtns = document.querySelectorAll(`.option.language li`)

			listBtns.forEach(btn => {
				const btnType = btn.classList.value.split(' ')[0]

				if (btnType === language) {
					btn.classList.add('active')
				} else {
					btn.classList.remove('active')
				}
			})
		}

		if (language === 'English') setSystem('hepburn')
		if (language === 'Russian') setSystem('polivanov')
	}, [language])

	useEffect(() => {
		closeMenu('option.system')

		correctList()

		function correctList() {
			const listBtns = document.querySelectorAll(`.option.system li`)

			listBtns.forEach(btn => {
				const btnType = btn.classList.value.split(' ')[0]

				if (btnType === system) {
					btn.classList.add('active')
				} else {
					btn.classList.remove('active')
				}
			})
		}
	}, [system])

	useEffect(() => {
		closeMenu('option.guess')

		correctList()

		function correctList() {
			const listBtns = document.querySelectorAll(`.option.guess li`)

			listBtns.forEach(btn => {
				const btnType = btn.classList.value.split(' ')[0]

				if (btnType === guess.toString()) {
					btn.classList.add('active')
				} else {
					btn.classList.remove('active')
				}
			})
		}
	}, [guess])

	function closeMenu(className: string) {
		const menuElem = document.querySelector(`.${className}`)

		menuElem?.classList.remove('active')
	}

	return (
		<>
			<header><h1>Kana transformer</h1> v{libVersion.current}</header>
			<main>
				<div className='settings'>
					<div className='operation-container'>
						<p>I want to</p>
						<div className='option operation'>
							<p onClick={() => toggleMenu('option.operation')}>{operation}<span className='triangle'><Triangle/></span></p>
							<ul>
								<li 
									onClick={() => setOperation('transcribe kana')}
									className='transcribe'
									>transcribe kana
								</li>
								<li 
									onClick={() => setOperation('transform to kana')}
									className='transform'
									>transform to kana
								</li>
								<li 
									onClick={() => setOperation('convert kana')}
									className='convert'
									>convert kana
								</li>
							</ul>
						</div>
					</div>
					<div className='options-container'>
						<p onClick={() => toggleMenu('options-container')}>options<span className='arrow'><Arrow/></span></p>
						<div>
							<div className='non-transcribe'>
								<p>{operation === 'convert kana' ? 'convert to' : 'transform to'}</p>
								<div className='option kana'>
									<p onClick={() => toggleMenu('option.kana')}>{kana}<span className='triangle'><Triangle/></span></p>
									<ul>
										<li 
											onClick={() => setKana('hiragana')}
											className='hiragana'
											>hiragana
										</li>
										<li 
											onClick={() => setKana('katakana')}
											className='katakana'
											>katakana
										</li>
									</ul>
								</div>
							</div>
							<div className='non-convert'>
								<p>{operation === 'transcribe kana' ? 'to language' : 'from language'}</p>
								<div className='option language'>
									<p onClick={() => toggleMenu('option.language')}>{language}<span className='triangle'><Triangle/></span></p>
									<ul>
										<li 
											onClick={() => setLanguage('English')}
											className='English'
											>English
										</li>
										<li 
											onClick={() => setLanguage('Russian')}
											className='Russian'
											>Russian
										</li>
									</ul>
								</div>
							</div>
							<div className='non-convert'>
								<p>using system</p>
								<div className='option system'>
									<p onClick={() => toggleMenu('option.system')}>{system}<span className='triangle'><Triangle/></span></p>
									{ language === 'Russian' ? <ul>
										<li 
											onClick={() => setSystem('polivanov')}
											className='polivanov'
											>polivanov
										</li>
										<li 
											onClick={() => setSystem('nonstandard-ru')}
											className='nonstandard-ru'
											>nonstandard-ru
										</li>
										<li 
											onClick={() => setSystem('static-ru')}
											className='static-ru'
											>static-ru
										</li>
									</ul> :
									<ul>
										<li 
											onClick={() => setSystem('hepburn')}
											className='hepburn'
											>hepburn
										</li>
										<li 
											onClick={() => setSystem('kunrei-shiki')}
											className='kunrei-shiki'
											>kunrei-shiki
										</li>
										<li 
											onClick={() => setSystem('nihon-shiki')}
											className='nihon-shiki'
											>nihon-shiki
										</li>
									</ul> }
								</div>
							</div>
							<div className='non-transcribe non-convert'>
								<p>guess</p>
								<div className='option guess'>
									<p onClick={() => toggleMenu('option.guess')}>{`${guess}`}<span className='triangle'><Triangle/></span></p>
									<ul>
										<li 
											onClick={() => setGuess(false)}
											className='false'
											>false
										</li>
										<li 
											onClick={() => setGuess(true)}
											className='true'
											>true
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='type-block'>
					<textarea
						className='input'
						onChange={(event) => setInput(event.target.value)}
						spellCheck={false}
						placeholder={
							`Use ${
								operation === 'transcribe kana' ? 'kana' :
								operation === 'transform to kana' ? language :
								operation === 'convert kana' ? kana === 'hiragana' ? 'katakana' : 'hiragana' : 
								'something...'
							}`
						}
					/>
					<textarea
						className='result'
						value={result}
						spellCheck={false}
						onChange={(event) => setResult(event.target.value)}
					/>
				</div>
			</main>
			<footer>
				<div>
					<a href='https://github.com/18degrees/kana-transformer'>
						<img src={process.env.PUBLIC_URL + '/images/github-mark.png'} alt='github logo'></img>
					</a>
				</div>
			</footer>
			<style>
				{`
					.options-container.active > div {
						height: ${
							operation === 'transform to kana' ? 235 : 
							operation === 'transcribe kana' ? 165 : 90
						}px
					}
					.non-transcribe {
						display: ${operation === 'transcribe kana' ? 'none !important' : 'unset'}
					}
					.non-convert {
						display: ${operation === 'convert kana' ? 'none !important' : 'unset'}
					}
					.non-transform {
						display: ${operation === 'transform to kana' ? 'none !important' : 'unset'}
					}

					@media (max-width: 425px) {
						.options-container.active > div {
							height: ${
								operation === 'transform to kana' ? 355 : 
								operation === 'transcribe kana' ? 200 : 120
							}px
						}
					}
				`}
			</style>
		</>
		)
}

export default App;

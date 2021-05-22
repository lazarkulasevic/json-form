import slugify from './slugify.js'
import syntaxHighlight from './syntax-highlight.js'

const formEl = document.getElementById('dynamic-form')
const generator = document.getElementById('generator')
const generateBlock = document.getElementById('btn-generate')
const jsonPlaceholder = document.getElementById('json')
const jsonHighlighted = document.getElementById('json-highlighted')
const jsonWrapper = document.querySelector('.json-wrapper')

const copyBtn = document.getElementById('copy')
const saveBtn = document.getElementById('save-local')
const minifyBtn = document.getElementById('minify')
const resetBtn = document.getElementById('reset')

const block = (num, key, value) => {
    key = key ?? 'Key-' + (num + 1)
    value = value ?? ''

    return `
        <div class="form-group">
            <span class="remove-block float-right">✕</span>
            <div id="label_${num}" class="pl-1 m-1 mr-5" contentEditable="true">${key}</div>
            <input id="input_${num}" type="text" class="form-control" aria-describedby="Name" value="${value}" placeholder="Enter value" autocomplete="off">
        </div>
    `
}

let blocks = [block(0), block(1)]
let blocksNum = blocks.length
const formSaved = initFormSaved()

initForm(blocks)

function initForm (blocks) {
    if (formSaved) {
        blocks = getSavedForm()
    }
    blocks.forEach(block => generator.innerHTML += block)
    saveFormInSessionStorage()
}

function getSavedForm () {
    let counter = 0
    blocks = []
    for (const prop in formSaved) {
        blocks.push(block(counter, prop, formSaved[prop]))
        counter++
    }
    return blocks
}

function initFormSaved () {
    const formSavedInSessionStorage = JSON.parse(sessionStorage.getItem('dynamic-form-session'))
    const formSavedInLocalStorage = JSON.parse(localStorage.getItem('dynamic-form'))
    return formSavedInSessionStorage ?? formSavedInLocalStorage
}

generateBlock.addEventListener('click', () => {
    blocksNum = generator.children.length
    const newBlock = document.createElement('div')
    newBlock.innerHTML = block(blocksNum).trim('').slice(24, -6).trim()
    generator.appendChild(newBlock)
    blocksNum++
    saveFormInSessionStorage()
})

formEl.addEventListener('submit', event => {
    event.preventDefault()
    const json = JSON.stringify(formData(), null, 4)
    jsonPlaceholder.value = json
    jsonHighlighted.innerHTML = syntaxHighlight(json)
    
    const placeholderHeight = jsonPlaceholder.scrollHeight + 'px'
    const placeholders = [jsonWrapper, jsonPlaceholder, jsonHighlighted]
    placeholders.forEach(placeholder => {
        placeholder.style.height = placeholderHeight
    })

    copyBtn.disabled = false
    minifyBtn.disabled = false
})

jsonPlaceholder.addEventListener('focus', () => {
    jsonHighlighted.classList.add('hide')
})

jsonPlaceholder.addEventListener('blur', () => {
    jsonHighlighted.classList.remove('hide')
})

copyBtn.addEventListener('click', () => {
    jsonPlaceholder.select()
    jsonPlaceholder.setSelectionRange(0, 99999)
    document.execCommand('copy')
    copyBtn.textContent = 'COPIED!'
    setTimeout(() => {
        copyBtn.textContent = 'COPY JSON'
    }, 2000)
})

generator.addEventListener('click', event => {
    switch (event.target.tagName) {
        case 'DIV':
            saveOnBlur(event.target)
            break
        case 'INPUT':
            saveOnBlur(event.target)
            break
        case 'SPAN':
            event.target.parentElement.remove()
            saveFormInSessionStorage()
            break
    }
})

saveBtn.addEventListener('click', () => {
    saveFormInLocalStorage()
    alert('Form is saved in Local Storage.')
})

minifyBtn.addEventListener('click', event => {
    if (event.target.textContent === 'Minify') {
        event.target.textContent = 'Beautify'
        jsonPlaceholder.value = JSON.stringify(formData())
        jsonHighlighted.classList.add('hide')
    } else {
        event.target.textContent = 'Minify'
        jsonPlaceholder.value = JSON.stringify(formData(), null, 4)
        jsonHighlighted.classList.remove('hide')
    }
})

resetBtn.addEventListener('click', () => {
    sessionStorage.clear()
    location.reload()
})

function saveOnBlur (elem) {
    elem.addEventListener('blur', () => {
        saveFormInSessionStorage()
    })
}

function formData (sessionStorage = true, form = {}) {
    const blocksAll = generator.children

    for (let i = 0; i < blocksAll.length; i++) {
        let key, value;
        for (let j = 0; j < blocksAll[i].children.length; j++) {
            if (j % 3 === 1) {
                key = slugify(blocksAll[i].children[j].textContent)
            }
            if (j % 3 === 2) {
                value = blocksAll[i].children[j].value
            }            
        }
        if (sessionStorage) {
            form[key] = value
        } else {
            form[key] = ''
        }
    }
    return form
}

function saveFormInSessionStorage () {
    const data = formData()
    sessionStorage.setItem('dynamic-form-session', JSON.stringify(data))
}

function saveFormInLocalStorage () {
    const data = formData(false)
    localStorage.setItem('dynamic-form', JSON.stringify(data))
}

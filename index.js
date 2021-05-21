import slugify from './slugify.js'

const formEl = document.getElementById('dynamic-form')
const generator = document.getElementById('generator')
const generateBlock = document.getElementById('btn-generate')
const jsonPlaceholder = document.getElementById('json')
const copyBtn = document.getElementById('copy')

// colorize key and value - Miskova ideja

const block = (num, key, value) => `
    <div class="form-group" data-block="block_${num}">
        <span class="remove-block float-right">✕</span>
        <div id="label_${num}" class="pl-1 m-1 mr-5" contentEditable="true">${key ?? 'Key ' + (num + 1)}</div>
        <input id="input_${num}" type="text" class="form-control" aria-describedby="Name" value="${value ?? ''}" placeholder="Enter value" autocomplete="off">
    </div>
`
let blocks = [block(0, 'Key 1'), block(1, 'Key 2')]

const formSavedInLocalStorage = JSON.parse(localStorage.getItem('dynamic-form'))
const formSavedInSessionStorage = JSON.parse(sessionStorage.getItem('dynamic-form-session'))
const formSaved = formSavedInSessionStorage || formSavedInLocalStorage

if (formSaved) {
    let counter = 0
    blocks = []
    for (const prop in formSaved) {
        blocks.push(block(counter, prop, formSaved[prop]))
        counter++
    }
    saveFormInSessionStorage()
} else {
    saveFormInLocalStorage()
}

generateBlock.addEventListener('click', () => {
    blocks.push(block(blocks.length))
    generator.innerHTML += block(blocks.length - 1)
    saveFormInLocalStorage()
})

formEl.addEventListener('submit', event => {
    event.preventDefault()
    const form = formData()
    jsonPlaceholder.value = JSON.stringify(form)
    copyBtn.disabled = false
    jsonPlaceholder.style.height = jsonPlaceholder.scrollHeight + 'px'
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
            onBlur(event.target)
            break
        case 'INPUT':
            onBlur(event.target, false)
            break
        case 'SPAN':
            console.log('remove block')
            break
    }
})

function onBlur (elem, localStorage = true) {
    elem.addEventListener('blur', () => {
        if (localStorage) {
            saveFormInLocalStorage()
        }
        saveFormInSessionStorage()
    })
}

function formData (localStorage = true, form = {}) {
    const blocksAll = generator.children

    for (let i = 0; i < blocksAll.length; i++) {
        let key, value;
        for (let j = 0; j < blocksAll[i].children.length; j++) {
            if (j % 3 === 1) {
                key = blocksAll[i].children[j].textContent
            } else if (j % 3 === 2) {
                value = blocksAll[i].children[j].value
            }            
        }
        if (localStorage) {
            form[slugify(key)] = ''
        } else {
            form[slugify(key)] = value
        }
    }
    return form
}

function initForm (blocks) {
    blocks.forEach(block => generator.innerHTML += block)
}

function saveFormInLocalStorage () {
    initForm(blocks)
    localStorage.setItem('dynamic-form', JSON.stringify(formData()))
}

function saveFormInSessionStorage () {
    initForm(blocks)
    sessionStorage.setItem('dynamic-form-session', JSON.stringify(formData(false)))
}

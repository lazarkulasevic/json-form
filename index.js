import slugify from './slugify.js'

const formEl = document.getElementById('dynamic-form')
const generator = document.getElementById('generator')
const generateBlock = document.getElementById('btn-generate')
const jsonPlaceholder = document.getElementById('json')
const copyBtn = document.getElementById('copy')
const saveBtn = document.getElementById('save-local')

// colorize key and value - Miskova ideja

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
const formSaved = initFormSaved()

function initFormSaved () {
    const formSavedInLocalStorage = JSON.parse(localStorage.getItem('dynamic-form'))
    const formSavedInSessionStorage = JSON.parse(sessionStorage.getItem('dynamic-form-session'))
    return formSavedInSessionStorage ?? formSavedInLocalStorage
}

if (formSaved) {
    blocks = getSavedForm()
    initForm(blocks)
    saveFormInSessionStorage()
} else {
    initForm(blocks)
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

generateBlock.addEventListener('click', () => {
    // if (formSaved) {
    //     blocks = getSavedForm()
    // }
    // blocks.push(block(blocks.length))
    generator.innerHTML += block(blocks.length + 1)
    // saveFormInSessionStorage()
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
            onBlur(event.target)
            break
        case 'SPAN':
            event.target.parentElement.remove()
            saveFormInSessionStorage()
            break
    }
})

saveBtn.addEventListener('click', () => {
    saveFormInLocalStorage()
})



function onBlur (elem) {
    elem.addEventListener('blur', () => {
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

function saveFormInSessionStorage () {
    const data = formData(false)
    sessionStorage.setItem('dynamic-form-session', JSON.stringify(data))
}

function saveFormInLocalStorage () {
    const data = formData()
    localStorage.setItem('dynamic-form', JSON.stringify(data))
}

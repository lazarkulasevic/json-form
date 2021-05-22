function slugify (text, ampersand = 'and') {
    const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿỳýœæŕśńṕẃǵǹḿǘẍźḧ'
    const b = 'aaaaeeeeiiiioooouuuuncsyyyoarsnpwgnmuxzh'
    const p = new RegExp(a.split('').join('|'), 'g')
  
    return text.toString().toLowerCase()
      .replace(/[\s_]+/g, '-')          // Replace whitespace and underscore with single hyphen
      .replace(p, c =>
        b.charAt(a.indexOf(c)))         // Replace special chars
      .replace(/&/g, `-${ampersand}-`)  // Replace ampersand with custom word
      .replace(/[^\w-]+/g, '')          // Remove all non-word chars
      .replace(/--+/g, '-')             // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, '')          // Remove leading and trailing hyphens
}
  
export default slugify
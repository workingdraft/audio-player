export default (element, name, id) => (
  Array.from(element.querySelectorAll(`[data-${name}-${id}]`))
)

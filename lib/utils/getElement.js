export default (element, name, id) => (
  element.querySelector(`[data-${name}-${id}]`)
)

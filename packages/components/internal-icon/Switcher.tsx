import { defineComponent } from 'vue'

export default defineComponent({
  name: "TreeSwitcher",
  render() {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 32 32"
        width="1em"
        height="1em"
        fill="currentColor"
      >
        <path d="M12 8l-1.41 1.41L16.17 15l-5.58 5.59L12 22l7-7z" />
      </svg>
    )
  }
})
import * as React from "react"
import ReactDOM from "react-dom"
import { Frame, useMotionValue, useTransform, useAnimation } from "framer"
import "./styles.css"

// forked
function Thumb({ up = false, animationProgress, ...props }) {
  const angle0 = up ? 15 : -15
  const angle1 = up ? -40 : 40
  const rotate = useTransform(
    animationProgress,
    [0, 0.2, 1],
    [angle0, angle0, angle1]
  )
  const opacity = useTransform(animationProgress, [0, 0.1, 1], [0, 1, 1])
  return (
    <Frame
      size={40}
      opacity={opacity}
      rotate={rotate}
      originX={-2.5}
      originY={2.5}
      background="transparent"
      {...props}
      style={{ fontSize: 50 }}
    >
      {up ? "👍" : "👎"}
    </Frame>
  )
}

function Card({ image, backgroundColor, onThumbUp, onThumbDown }) {
  const position = useMotionValue(0)
  const rotate = useTransform(position, [-200, 200], [-50, 50])
  const opacity = useTransform(
    position,
    [-200, -100, 0, 100, 200],
    [0, 1, 1, 1, 0]
  )
  const thumbUpAnimProgress = useTransform(position, [-200, 0, 200], [0, 0, 1])
  const thumbDownAnimProgress = useTransform(
    position,
    [-200, 0, 200],
    [1, 0, 0]
  )
  const anim = useAnimation()

  const style = {
    backgroundImage: `url(${image})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundColor,
    boxShadow: "2px 2px 10px 0 rgba(0,0,0,0.25)"
  }
  return (
    <Frame
      center
      drag="x"
      height={300}
      overflow="hidden"
      style={style}
      dragConstraints={{ left: -200, right: 200 }}
      x={position}
      animate={anim}
      rotate={rotate}
      opacity={opacity}
      borderRadius={10}
      onDragEnd={async function(_, info) {
        if (Math.abs(info.point.x) < 100) {
          anim.start({ x: 0 })
        } else {
          const thumbDown = info.point.x < 0
          await anim.start({ x: thumbDown ? -200 : 200 })
          if (thumbDown) {
            onThumbDown && onThumbDown()
          } else {
            onThumbUp && onThumbUp()
          }
        }
      }}
    >
      <Thumb bottom={10} left={10} animationProgress={thumbDownAnimProgress} />
      <Thumb
        up
        bottom={10}
        right={10}
        animationProgress={thumbUpAnimProgress}
      />
    </Frame>
  )
}

function App() {
  const cards = [
    {
      name: "Strong Skinny",
      image:
        "https://cdn.glitch.com/071e5391-90f7-476b-b96c-1f51f7106b0c%2Fbird_strong_small.svg?v=1560032432704",
      backgroundColor: "#55CCFF"
    },
    {
      name: "Real-life Skinny",
      image:
        "https://cdn.glitch.com/071e5391-90f7-476b-b96c-1f51f7106b0c%2Fbird_fat_black_medium.svg?v=1557968629951",
      backgroundColor: "#FF88AA"
    },
    {
      name: "React dude with a sword",
      image:
        "https://cdn.glitch.com/071e5391-90f7-476b-b96c-1f51f7106b0c%2Fdesigner.svg?v=1560273527081",
      backgroundColor: "#66BB66"
    }
  ]
  return (
    <div className="App">
      <Frame
        position="relative"
        width={200}
        background="transparent"
        style={{ zIndex: 1, marginRight: 32 }}
      >
        {cards.reverse().map(({ image, backgroundColor }) => (
          <Card key={image} image={image} backgroundColor={backgroundColor} />
        ))}
      </Frame>
      <Frame
        position="relative"
        borderRadius={8}
        background="#eee"
        style={{ padding: 8 }}
      />
    </div>
  )
}
const rootElement = document.getElementById("root")
ReactDOM.render(<App />, rootElement)

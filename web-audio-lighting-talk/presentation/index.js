// Import React
import React from "react";

// Import Spectacle Core tags
import {
  Appear,
  BlockQuote,
  Quote,
  Cite,
  Code,
  Deck,
  Heading,
  ListItem,
  List,
  Link,
  Slide,
  S,
  Image,
  Text
} from "spectacle";

import CodeSlide from "spectacle-code-slide";

// Import image preloader util
import preloader from "spectacle/lib/utils/preloader";

// Import theme
import createTheme from "spectacle/lib/themes/default";

// Require CSS
require("normalize.css");
require("spectacle/lib/themes/default/index.css");

require("./demoPresets");


const images = {
  simple: require("../assets/1.jpg"),
  complex: require("../assets/2.jpg")
};

preloader(images);

const theme = createTheme({
  primary: "white",
  secondary: "#1F2022",
  tertiary: "#03A9FC",
  quartenary: "#CECECE"
}, {
  primary: "Montserrat",
  secondary: "Helvetica"
});

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck transition={["zoom", "slide"]} transitionDuration={500} theme={theme}>
        <Slide transition={["zoom"]} bgColor="secondary">
          <Heading size={1} fit lineHeight={1} textColor="primary">
            Introduction to Web Audio API
          </Heading>
          <Text margin="10px 0 0" textColor="tertiary" size={3} bold>
            a.k.a: What the heck is it?
          </Text>
        </Slide>
        <Slide transition={["fade"]} bgColor="tertiary">
          <Heading size={5} textColor="secondary">Web Audio API is:</Heading>
          <List>
            <ListItem>HTML5 new APIs</ListItem>
            <ListItem>manipuate audio signals</ListItem>
            <ListItem>声音界的canvas或者WebGL</ListItem>
            <Appear>
              <ListItem>所以WebGL也可以叫图像界的Web Audio API...</ListItem>
            </Appear>
          </List>
        </Slide>
        <Slide transition={["slide"]} bgColor="tertiary">
          <Heading size={5} textColor="secondary">Why/where do we need it?</Heading>
          <List>
            <ListItem>Streaming</ListItem>
            <ListItem>Game!</ListItem>
            <ListItem>Realtime Audio Conference</ListItem>
            <ListItem>Like other HTML5 stuffs, the goal:</ListItem>
            <Appear>
              <ListItem><S type="bold">不带Flash玩</S></ListItem>
            </Appear>
          </List>
        </Slide>
        <Slide transition={["slide"]} bgColor="primary">
          <Heading size={2}>Let's get started</Heading>
          <Heading size={4} textColor="tertiary">Setup environment</Heading>
        </Slide>
        <Slide tranition={["fade"]} bgColor="primary">
          <Heading size={4} textColor="secondary">Basic concepts</Heading>
          <List>
            <ListItem>Everything is a node</ListItem>
            <ListItem>Three types of nodes</ListItem>
            <ListItem>Source</ListItem>
            <ListItem>Destination</ListItem>
            <ListItem>Processor</ListItem>
          </List>
        </Slide>
        <Slide>
          <Image src={images.simple} width={300} />
        </Slide>
        <Slide>
          <Image src={images.complex} width={300} />
        </Slide>
        <Slide transition={["slide"]} bgColor="tertiary">
          <Heading size={2} textColor="secondary">DEMO</Heading>
          <Heading size={4} fit textColor="primary">Hello Sinewave</Heading>
        </Slide>
        <Slide tranition={["fade"]} bgColor="primary">
          <Heading size={2} textColor="secondary">other DEMOs</Heading>
          <Appear>
            <Heading size={4} textColor="quartenary"><Link href="http://webaudioapi.com/samples/" target="_blank">外包了</Link></Heading>
          </Appear>
        </Slide>
        <Slide tranition={["fade"]} bgColor="primary">
          <Heading size={2} fit>One important concept: Parameter</Heading>
        </Slide>
        <CodeSlide
          lang="js"
          code={require("raw-loader!./basicSetup.example")}
          ranges={[
            { loc: [0, 3], title: "Create Nodes" },
            { loc: [4, 6], title: "Setup Connections" }
          ]}
        />
        <Slide tranition={["fade"]} bgColor="primary">
          <Heading size={2} fit>Another important concept: Time</Heading>
        </Slide>
        <Slide tranition={["fade"]} bgColor="primary">
          <BlockQuote>
            <Quote textColor="secondary" fit>Don't use setTimeout when you do animation</Quote>
            <Cite>Denis Vergnes</Cite>
          </BlockQuote>
        </Slide>
        <CodeSlide
          lang="js"
          code={require("raw-loader!./timeWrongly.example")}
          ranges={[
            { loc: [0, 7], title: "Setup" },
            { loc: [8, 16], title: "Change parameters constantly" }
          ]}
        />
        <Slide tranition={["fade"]} bgColor="primary">
          <Heading size={4}><Code>context.currentTime</Code> for the rescue</Heading>
          <Heading size={5}>DEMO</Heading>
        </Slide>
        <CodeSlide
          lang="js"
          code={require("raw-loader!./timeCorrectly.example")}
          ranges={[
            { loc: [0, 1], title: "get current time" },
            { loc: [3, 8], title: "Pre schedule the changes" }
          ]}
        />
        <Slide>
          <Heading size={3}>Interesting Stuffs</Heading>
          <List>
            <ListItem>
              <Link target="_blank" href="https://github.com/notthetup/awesome-webaudio">Awesome Web Audio</Link>
            </ListItem>
            <Appear>
              <ListItem>
                <Link target="_blank" href="http://chriest.studio/code-player/app.html?root=A&beatsPerBar=4&bpm=130&melodyScale=blues&bassScale=minorPentatonic&src=http%3A%2F%2Flocalhost%3A8080%2FTableDataProvider.jsx">DBX Frontend TableDataProvider.jsx</Link>
              </ListItem>
            </Appear>
          </List>
        </Slide>
      </Deck>
    );
  }
}

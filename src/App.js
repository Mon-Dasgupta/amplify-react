// import React, { useState, useEffect } from "react";
// import "./App.css";
// import "@aws-amplify/ui-react/styles.css";
// import { generateClient } from "aws-amplify/api";
// import awsconfig from "./aws-exports";
// import { Storage } from "aws-amplify"


// import {
//   Button,
//   Flex,
//   Heading,
//   Image,
//   Text,
//   TextField,
//   View,
//   withAuthenticator,
// } from "@aws-amplify/ui-react";


// import { listNotes } from "./graphql/queries";
// import {
//   createNote as createNoteMutation,
//   deleteNote as deleteNoteMutation,
// } from "./graphql/mutations";



// const api = generateClient(awsconfig);

// const App = ({ signOut }) => {
//   const [notes, setNotes] = useState([]);

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   async function fetchNotes() {
//     const apiData = await api.graphql({ query: listNotes });
//     const notesFromAPI = apiData.data.listNotes.items;
//     await Promise.all(
//       notesFromAPI.map(async (note) => {
//         if (note.image) {
//           const url = await Storage.get(note.name);
//           note.image = url;
//         }
//         return note;
//       })
//     );
//     setNotes(notesFromAPI);
//   }

//   async function createNote(event) {
//     event.preventDefault();
//     const form = new FormData(event.target);
//     const image = form.get("image");
//     const data = {
//       name: form.get("name"),
//       description: form.get("description"),
//       image: image.name,
//     };
//     if (!!data.image) await Storage.put(data.name, image);
//     await api.graphql({
//       query: createNoteMutation,
//       variables: { input: data },
//     });
//     fetchNotes();
//     event.target.reset();
//   }
  

//   async function deleteNote({ id, name }) {
//     const newNotes = notes.filter((note) => note.id !== id);
//     setNotes(newNotes);
//     await Storage.remove(name);
//     await api.graphql({
//       query: deleteNoteMutation,
//       variables: { input: { id } },
//     });
//   }

//   return (
//     <View className="App">
//       <Heading level={1}>My Notes App</Heading>
//       <View as="form" margin="3rem 0" onSubmit={createNote}>
//         <Flex direction="row" justifyContent="center">
//           <TextField
//             name="name"
//             placeholder="Note Name"
//             label="Note Name"
//             labelHidden
//             variation="quiet"
//             required
//           />
//           <View
//             name="image"
//             as="input"
//             type="file"
//             style={{ alignSelf: "end" }}
//           />

//           <TextField
//             name="description"
//             placeholder="Note Description"
//             label="Note Description"
//             labelHidden
//             variation="quiet"
//             required
//           />
//           <Button type="submit" variation="primary">
//             Create Note
//           </Button>
//         </Flex>
//       </View>
//       <Heading level={2}>Current Notes</Heading>
//       <View margin="3rem 0">
//         {notes.map((note) => (
//           <Flex
//             key={note.id || note.name}
//             direction="row"
//             justifyContent="center"
//             alignItems="center"
//           >
//             <Text as="strong" fontWeight={700}>
//               {note.name}
//             </Text>
//             <Text as="span">{note.description}</Text>

//             {note.image && (
//               <Image
//                 src={note.image}
//                 alt={`visual aid for ${notes.name}`}
//                 style={{ width: 400 }}
//               />
//             )}

//             <Button variation="link" onClick={() => deleteNote(note)}>
//               Delete note
//             </Button>
//           </Flex>
//         ))}
//       </View>
//       <Button onClick={signOut}>Sign Out</Button>
//     </View>
//   );
// };

// export default withAuthenticator(App);


import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/api";
import awsconfig from "./aws-exports";
import { uploadData } from "aws-amplify/storage"; // Correct import


import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextField,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";


import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";



const api = generateClient(awsconfig);

const App = ({ signOut }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await api.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await uploadData.get(note.name); // Using uploadData.get
          note.image = url;
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
    };
    if (!!data.image) await uploadData(data.name, image); // Using uploadData
    await api.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }
  

  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await uploadData.remove(name); // Using uploadData.remove
    await api.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <View className="App">
      <Heading level={1}>My Notes App</Heading>
      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <View
            name="image"
            as="input"
            type="file"
            style={{ alignSelf: "end" }}
          />

          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden
            variation="quiet"
            required
          />
          <Button type="submit" variation="primary">
            Create Note
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Current Notes</Heading>
      <View margin="3rem 0">
        {notes.map((note) => (
          <Flex
            key={note.id || note.name}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text as="strong" fontWeight={700}>
              {note.name}
            </Text>
            <Text as="span">{note.description}</Text>

            {note.image && (
              <Image
                src={note.image}
                alt={`visual aid for ${notes.name}`}
                style={{ width: 400 }}
              />
            )}

            <Button variation="link" onClick={() => deleteNote(note)}>
              Delete note
            </Button>
          </Flex>
        ))}
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);

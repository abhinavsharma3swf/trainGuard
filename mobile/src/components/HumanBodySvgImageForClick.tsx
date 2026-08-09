// import {StyleSheet, View} from "react-native";
// import Body, {BodyPartStyles, ExtendedBodyPart, Slug} from "react-native-body-highlighter";
// import {use, useState} from "react";
//
// export default function HumanBodySvgImageForClick() {
//
//     const [selectedMuscle, setSelectedMuscle] = useState<ExtendedBodyPart[]>([]);
//
//     const handleMusclePress = (muscle: ExtendedBodyPart, side?: 'left' | 'right',) => {
//         if (!side) {
//             return;
//         }
//
//         setSelectedMuscle((previous) => {
//             const alreadySelected = previous.some(
//                 (item) =>
//                     item.slug === muscle.slug &&
//                     item.side === side,
//             );
//
//             if (alreadySelected) {
//                 return previous.filter(
//                     (item) =>
//                         !(
//                             item.slug === muscle.slug &&
//                             item.side === side
//                         ),
//                 );
//             }
//
//             return [...previous, {
//                     slug: muscle.slug,
//                     side,
//                     intensity: 2,
//                     styles: {
//                         fill: '#d85108',
//                     },
//                 },
//             ];
//         });
//     };
//
//
//     return (
//         <View style={styles.container}>
//             <Body
//                 data={selectedMuscle}
//                 side={"front"}
//                 scale={1.5}
//                 gender={"male"}
//                 border="orange"
//                 onBodyPartPress={(muscle, side) => handleMusclePress(muscle, side)}
//                 />
//         </View>
//     )
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     }
// })


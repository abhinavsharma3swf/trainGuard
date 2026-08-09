import Svg, {Path} from 'react-native-svg';
import {
    backLeftAnkle,
    backLeftCalf,
    backLeftForearm,
    backLeftGlute,
    backLeftHamstring,
    backLeftLowerBack,
    backLeftShoulder,
    backLeftUpperBack,
    backRightAnkle,
    backRightCalf,
    backRightForearm,
    backRightGlute,
    backRightHamstring,
    backRightLowerBack,
    backRightShoulder,
    backRightUpperBack,
    bodyOutlineBack,
    bodyOutlineFront,
    BodyPart,
    frontLeftAdductor,
    frontLeftAnkle,
    frontLeftCalf,
    frontLeftChest,
    frontLeftFoot,
    frontLeftForearm,
    frontLeftKnee,
    frontLeftLowerAbs,
    frontLeftMidAbs,
    frontLeftOblique,
    frontLeftQuad,
    frontLeftShoulder,
    frontLeftUpperAbs,
    frontLeftUpperArm,
    frontRightAdductor,
    frontRightAnkle,
    frontRightCalf,
    frontRightChest,
    frontRightFoot,
    frontRightForearm,
    frontRightKnee,
    frontRightLowerAbs,
    frontRightMidAbs,
    frontRightOblique,
    frontRightQuad,
    frontRightShoulder,
    frontRightUpperAbs,
    frontRightUpperArm
} from "@/components/PathPoints";
import {useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";


export default function HumanBody() {

    const [selectedParts, setSelectedParts] = useState<BodyPart[]>([]);
    const [bodySide, setBodySide] = useState<'front' | 'back'>('front');
    // const rotateValue = useRef(new Animated.Value(0)).current;
    // const rotation = useRef(new Animated.Value(0)).current;
    // const [showingFront, setShowingFront] = useState(true);

    const togglePart = (part: BodyPart) => {
        setSelectedParts((currentSelections) => {

            if (currentSelections.includes(part)) {
                // Already selected → deselect it
                return currentSelections.filter(
                    (item) => item !== part,
                );
            }
            // Not selected → select it
            return [...currentSelections, part];
        });
    };

    // const rotateBody = () => {
    //     Animated.timing(rotateValue, {
    //         toValue: 90,
    //         duration: 200,
    //         useNativeDriver: true,
    //     }).start(() => {
    //         setBodySide((previous) =>
    //             previous === 'front' ? 'back' : 'front'
    //         );
    //
    //         rotateValue.setValue(-90);
    //
    //         Animated.timing(rotateValue, {
    //             toValue: 0,
    //             duration: 200,
    //             useNativeDriver: true,
    //         }).start();
    //     });
    // };

    // const rotateY = rotateValue.interpolate({
    //     inputRange: [-90, 0, 90],
    //     outputRange: ['-90deg', '0deg', '90deg'],
    // });

    // const rotateBody = () => {
    //     Animated.timing(rotation, {
    //         toValue: showingFront ? 180 : 0,
    //         duration: 700,
    //         useNativeDriver: true,
    //     }).start(() => {
    //         setShowingFront((previous) => !previous);
    //     });
    // };
    // const frontRotation = rotation.interpolate({
    //     inputRange: [0, 180],
    //     outputRange: ['0deg', '180deg'],
    // });
    // const backRotation = rotation.interpolate({
    //     inputRange: [0, 180],
    //     outputRange: ['180deg', '360deg'],
    // });


    return (
        <View>

            {/*<Animated.View*/}
            {/*    style={[*/}
            {/*        styles.body,*/}
            {/*        {*/}
            {/*            transform: [*/}
            {/*                { perspective: 1000 },*/}
            {/*                { rotateY: frontRotation },*/}
            {/*            ],*/}
            {/*            backfaceVisibility: 'hidden',*/}
            {/*        },*/}
            {/*    ]}*/}
            {/*>*/}
            {bodySide === 'front' ?
                <Svg
            width={300}
            height={400}
            viewBox="0 0 1122 1402"
        >
            <Path
                d={bodyOutlineFront}
                // fill="lightgray"
                stroke="#444"
                strokeWidth={10}
            />

            <Path
                d={frontLeftShoulder}
                fill={
                    selectedParts.includes(BodyPart.LeftShoulder)
                        ? '#d85108'
                        : 'grey'
                }
                // stroke="#777"
                // strokeWidth={1.5}
                onPress={() => togglePart(BodyPart.LeftShoulder)}
            />

            <Path
                d={frontRightShoulder}
                fill={
                    selectedParts.includes(BodyPart.RightShoulder)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.RightShoulder)}
            />

            <Path
                d={frontRightChest}
                fill={
                    selectedParts.includes(BodyPart.RightChest)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.RightChest)}
            />

            <Path
                d={frontLeftChest}
                fill={
                    selectedParts.includes(BodyPart.LeftChest)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.LeftChest)}
            />

            <Path
                d={frontRightUpperArm}
                fill={
                    selectedParts.includes(BodyPart.RightUpperArm)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.RightUpperArm)}
            />

            <Path
                d={frontLeftUpperArm}
                fill={
                    selectedParts.includes(BodyPart.LeftUpperArm)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.LeftUpperArm)}
            />

            <Path
                d={frontRightUpperAbs}
                fill={
                    selectedParts.includes(BodyPart.RightUpperAbs)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.RightUpperAbs)}
            />

            <Path
                d={frontLeftUpperAbs}
                fill={
                    selectedParts.includes(BodyPart.LeftUpperAbs)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.LeftUpperAbs)}
            />

            <Path
                d={frontRightMidAbs}
                fill={
                    selectedParts.includes(BodyPart.RightMidAbs)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.RightMidAbs)}
            />

            <Path
                d={frontLeftMidAbs}
                fill={
                    selectedParts.includes(BodyPart.LeftMidAbs)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.LeftMidAbs)}
            />

            <Path
                d={frontRightOblique}
                fill={
                    selectedParts.includes(BodyPart. RightOblique)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart. RightOblique)}
            />

            <Path
                d={frontLeftOblique}
                fill={
                    selectedParts.includes(BodyPart. LeftOblique)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart. LeftOblique)}
            />

            <Path
                d={frontLeftLowerAbs}
                fill={
                    selectedParts.includes(BodyPart.LeftLowerAbs)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.LeftLowerAbs)}
            />

            <Path
                d={frontRightLowerAbs}
                fill={
                    selectedParts.includes(BodyPart.RightLowerAbs)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.RightLowerAbs)}
            />

            <Path
                d={frontRightForearm}
                fill={
                    selectedParts.includes(BodyPart.RightForearm)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.RightForearm)}
            />

            <Path
                d={frontLeftForearm}
                fill={
                    selectedParts.includes(BodyPart.LeftForearm)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.LeftForearm)}
            />


            <Path
                d={frontRightAdductor}
                fill={
                    selectedParts.includes(BodyPart.RightAdductor)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.RightAdductor)}
            />


            <Path
                d={frontLeftAdductor}
                fill={
                    selectedParts.includes(BodyPart.LeftAdductor)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.LeftAdductor)}
            />

            <Path
                d={frontRightQuad}
                fill={
                    selectedParts.includes(BodyPart.RightQuad)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.RightQuad)}
            />

            <Path
                d={frontLeftQuad}
                fill={
                    selectedParts.includes(BodyPart.LeftQuad)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.LeftQuad)}
            />

            <Path
                d={frontLeftKnee}
                fill={
                    selectedParts.includes(BodyPart.LeftKnee)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.LeftKnee)}
            />

            <Path
                d={frontRightKnee}
                fill={
                    selectedParts.includes(BodyPart.RightKnee)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.RightKnee)}
            />

            <Path
                d={frontLeftCalf}
                fill={
                    selectedParts.includes(BodyPart.LeftCalf)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.LeftCalf)}
            />

            <Path
                d={frontRightCalf}
                fill={
                    selectedParts.includes(BodyPart.RightCalf)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.RightCalf)}
            />

            <Path
                d={frontLeftAnkle}
                fill={
                    selectedParts.includes(BodyPart.LeftAnkle)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.LeftAnkle)}
            />

            <Path
                d={frontRightAnkle}
                fill={
                    selectedParts.includes(BodyPart.RightAnkle)
                        ? '#d85108'
                        : 'grey'
                }
                onPress={() => togglePart(BodyPart.RightAnkle)}
            />

                <Path
                    d={frontLeftFoot}
                    fill={
                        selectedParts.includes(BodyPart.LeftFoot)
                            ? '#d85108'
                            : 'grey'
                    }
                    onPress={() => togglePart(BodyPart.LeftFoot)}
                />

                <Path
                    d={frontRightFoot}
                    fill={
                        selectedParts.includes(BodyPart.RightFoot)
                            ? '#d85108'
                            : 'grey'
                    }
                    onPress={() => togglePart(BodyPart.RightFoot)}
                />

        </Svg> :

    <Svg
        width={300}
        height={400}
        viewBox="0 0 1122 1402"
    >
        <Path
            id="back-body-outline"
            d={bodyOutlineBack}
            // fill="#e5e5e5"
            stroke="#444"
            strokeWidth={10}
        />

        <Path
            d={backRightShoulder}
            fill={
                selectedParts.includes(BodyPart.RightBackShoulder)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.RightBackShoulder)}
        />

        <Path
            d={backLeftShoulder}
            fill={
                selectedParts.includes(BodyPart.LeftBackShoulder)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.LeftBackShoulder)}
        />

        <Path
            d={backRightUpperBack}
            fill={
                selectedParts.includes(BodyPart.RightUpperBack)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.RightUpperBack)}
        />

        <Path
            d={backLeftUpperBack}
            fill={
                selectedParts.includes(BodyPart.LeftUpperBack)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.LeftUpperBack)}
        />

        <Path
            d={backLeftLowerBack}
            fill={
                selectedParts.includes(BodyPart.LeftLowerBack)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.LeftLowerBack)}
        />

        <Path
            d={backRightLowerBack}
            fill={
                selectedParts.includes(BodyPart.RightLowerBack)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.RightLowerBack)}
        />

        <Path
            d={backRightForearm}
            fill={
                selectedParts.includes(BodyPart.BackRightForearm)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.BackRightForearm)}
        />

        <Path
            d={backLeftForearm}
            fill={
                selectedParts.includes(BodyPart.BackLeftForearm)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.BackLeftForearm)}
        />

        <Path
            d={backLeftGlute}
            fill={
                selectedParts.includes(BodyPart.LeftGlute)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.LeftGlute)}
        />

        <Path
            d={backRightGlute}
            fill={
                selectedParts.includes(BodyPart.RightGlute)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.RightGlute)}
        />

        <Path
            d={backLeftHamstring}
            fill={
                selectedParts.includes(BodyPart.LeftHamstring)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.LeftHamstring)}
        />

        <Path
            d={backRightHamstring}
            fill={
                selectedParts.includes(BodyPart.RightHamstring)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.RightHamstring)}
        />

        <Path
            d={backRightCalf}
            fill={
                selectedParts.includes(BodyPart.BackRightCalf)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.BackRightCalf)}
        />

        <Path
            d={backLeftCalf}
            fill={
                selectedParts.includes(BodyPart.BackLeftCalf)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.BackLeftCalf)}
        />

        <Path
            d={backLeftAnkle}
            fill={
                selectedParts.includes(BodyPart.BackLeftAnkle)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.BackLeftAnkle)}
        />

        <Path
            d={backRightAnkle}
            fill={
                selectedParts.includes(BodyPart.BackRightAnkle)
                    ? '#d85108'
                    : 'grey'
            }
            onPress={() => togglePart(BodyPart.BackRightAnkle)}
        />

    </Svg>}
        {/*</Animated.View>*/}

            <Pressable
                // title="Rotate"
                onPress={() =>
                    setBodySide((previous) =>
                        previous === 'front' ? 'back' : 'front'
                    )
                }
            ><Text style={{color: "red"}}>TURN</Text></Pressable>/

        </View>
    );
}

const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        width: 100,
        height: 500,
        alignSelf: 'center',
        justifyContent: 'center',

    },
});

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
import {JSX} from "react";
import {StyleSheet, View} from "react-native";

interface HumanBodyProps {
    selectedBodyParts: BodyPart[],
    setSelectedBodyParts: (value: (((prevState: BodyPart[]) => BodyPart[]) | BodyPart[])) => void
}

export default function HumanBody({
                                      setSelectedBodyParts,
                                      selectedBodyParts,
                                  }: HumanBodyProps): JSX.Element {

    const togglePart = (part: BodyPart) => {
        setSelectedBodyParts((currentSelection) => {
            if (currentSelection.includes(part)) {
                // Already selected → deselect it
                return currentSelection.filter(
                    (item: any) => item !== part,
                );
            }
            // Not selected → select it
            return [...currentSelection, part];
        });
    };

    return (
        <View style={styles.bodyContainer}>

            <View>
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
                            selectedBodyParts.includes(BodyPart.LeftShoulder)
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
                            selectedBodyParts.includes(BodyPart.RightShoulder)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightShoulder)}
                    />

                    <Path
                        d={frontRightChest}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightChest)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightChest)}
                    />

                    <Path
                        d={frontLeftChest}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftChest)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftChest)}
                    />

                    <Path
                        d={frontRightUpperArm}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightUpperArm)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightUpperArm)}
                    />

                    <Path
                        d={frontLeftUpperArm}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftUpperArm)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftUpperArm)}
                    />

                    <Path
                        d={frontRightUpperAbs}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightUpperAbs)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightUpperAbs)}
                    />

                    <Path
                        d={frontLeftUpperAbs}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftUpperAbs)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftUpperAbs)}
                    />

                    <Path
                        d={frontRightMidAbs}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightMidAbs)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightMidAbs)}
                    />

                    <Path
                        d={frontLeftMidAbs}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftMidAbs)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftMidAbs)}
                    />

                    <Path
                        d={frontRightOblique}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightOblique)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightOblique)}
                    />

                    <Path
                        d={frontLeftOblique}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftOblique)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftOblique)}
                    />

                    <Path
                        d={frontLeftLowerAbs}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftLowerAbs)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftLowerAbs)}
                    />

                    <Path
                        d={frontRightLowerAbs}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightLowerAbs)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightLowerAbs)}
                    />

                    <Path
                        d={frontRightForearm}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightForearm)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightForearm)}
                    />

                    <Path
                        d={frontLeftForearm}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftForearm)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftForearm)}
                    />


                    <Path
                        d={frontRightAdductor}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightAdductor)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightAdductor)}
                    />


                    <Path
                        d={frontLeftAdductor}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftAdductor)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftAdductor)}
                    />

                    <Path
                        d={frontRightQuad}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightQuad)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightQuad)}
                    />

                    <Path
                        d={frontLeftQuad}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftQuad)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftQuad)}
                    />

                    <Path
                        d={frontLeftKnee}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftKnee)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftKnee)}
                    />

                    <Path
                        d={frontRightKnee}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightKnee)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightKnee)}
                    />

                    <Path
                        d={frontLeftCalf}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftCalf)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftCalf)}
                    />

                    <Path
                        d={frontRightCalf}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightCalf)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightCalf)}
                    />

                    <Path
                        d={frontLeftAnkle}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftAnkle)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftAnkle)}
                    />

                    <Path
                        d={frontRightAnkle}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightAnkle)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightAnkle)}
                    />

                    <Path
                        d={frontLeftFoot}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftFoot)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftFoot)}
                    />

                    <Path
                        d={frontRightFoot}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightFoot)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightFoot)}
                    />

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
                            selectedBodyParts.includes(BodyPart.RightBackShoulder)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightBackShoulder)}
                    />

                    <Path
                        d={backLeftShoulder}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftBackShoulder)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftBackShoulder)}
                    />

                    <Path
                        d={backRightUpperBack}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightUpperBack)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightUpperBack)}
                    />

                    <Path
                        d={backLeftUpperBack}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftUpperBack)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftUpperBack)}
                    />

                    <Path
                        d={backLeftLowerBack}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftLowerBack)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftLowerBack)}
                    />

                    <Path
                        d={backRightLowerBack}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightLowerBack)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightLowerBack)}
                    />

                    <Path
                        d={backRightForearm}
                        fill={
                            selectedBodyParts.includes(BodyPart.BackRightForearm)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.BackRightForearm)}
                    />

                    <Path
                        d={backLeftForearm}
                        fill={
                            selectedBodyParts.includes(BodyPart.BackLeftForearm)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.BackLeftForearm)}
                    />

                    <Path
                        d={backLeftGlute}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftGlute)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftGlute)}
                    />

                    <Path
                        d={backRightGlute}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightGlute)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightGlute)}
                    />

                    <Path
                        d={backLeftHamstring}
                        fill={
                            selectedBodyParts.includes(BodyPart.LeftHamstring)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.LeftHamstring)}
                    />

                    <Path
                        d={backRightHamstring}
                        fill={
                            selectedBodyParts.includes(BodyPart.RightHamstring)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.RightHamstring)}
                    />

                    <Path
                        d={backRightCalf}
                        fill={
                            selectedBodyParts.includes(BodyPart.BackRightCalf)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.BackRightCalf)}
                    />

                    <Path
                        d={backLeftCalf}
                        fill={
                            selectedBodyParts.includes(BodyPart.BackLeftCalf)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.BackLeftCalf)}
                    />

                    <Path
                        d={backLeftAnkle}
                        fill={
                            selectedBodyParts.includes(BodyPart.BackLeftAnkle)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.BackLeftAnkle)}
                    />

                    <Path
                        d={backRightAnkle}
                        fill={
                            selectedBodyParts.includes(BodyPart.BackRightAnkle)
                                ? '#d85108'
                                : 'grey'
                        }
                        onPress={() => togglePart(BodyPart.BackRightAnkle)}
                    />

                </Svg>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
});

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
    setSelectedBodyParts: (value:
                               | BodyPart[]
                               | (((prevState: BodyPart[]) => BodyPart[]) | BodyPart[])
    ) => void
    mode: 'checkin' | 'heatmap'
}

export default function HumanBody({
                                      setSelectedBodyParts,
                                      selectedBodyParts,
                                      mode
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

    const painCounts = selectedBodyParts.reduce((acc, part) => {
        acc[part] = (acc[part] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);


    const heatMapColor = (count: number) => {
        if(count === 0)return 'grey'
        if(count === 1)return 'green';
        if(count === 2)return 'red'
    }

    const getFillColor = (part: BodyPart) => {
        if(mode === 'checkin') {
            return selectedBodyParts.includes(part) ? '#d85108' : 'grey'
        }
        const count = painCounts[part] ?? 0;
        return heatMapColor(count);
    }

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
                            getFillColor(BodyPart.LeftShoulder)

                        }
                        // stroke="#777"
                        // strokeWidth={1.5}
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftShoulder) : undefined}
                    />

                    <Path
                        d={frontRightShoulder}
                        fill={
                            getFillColor(BodyPart.RightShoulder)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightShoulder) : undefined}
                    />

                    <Path
                        d={frontRightChest}
                        fill={
                            getFillColor(BodyPart.RightChest)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightChest) : undefined}
                    />

                    <Path
                        d={frontLeftChest}
                        fill={
                            getFillColor(BodyPart.LeftChest)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftChest) : undefined}
                    />

                    <Path
                        d={frontRightUpperArm}
                        fill={
                            getFillColor(BodyPart.RightUpperArm)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightUpperArm) : undefined}
                    />

                    <Path
                        d={frontLeftUpperArm}
                        fill={
                            getFillColor(BodyPart.LeftUpperArm)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftUpperArm) : undefined}
                    />

                    <Path
                        d={frontRightUpperAbs}
                        fill={
                            getFillColor(BodyPart.RightUpperAbs)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightUpperAbs) : undefined}
                    />

                    <Path
                        d={frontLeftUpperAbs}
                        fill={
                            getFillColor(BodyPart.LeftUpperAbs)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftUpperAbs) : undefined}
                    />

                    <Path
                        d={frontRightMidAbs}
                        fill={
                            getFillColor(BodyPart.RightMidAbs)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightMidAbs) : undefined}
                    />

                    <Path
                        d={frontLeftMidAbs}
                        fill={
                            getFillColor(BodyPart.LeftMidAbs)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftMidAbs) : undefined}
                    />

                    <Path
                        d={frontRightOblique}
                        fill={
                            getFillColor(BodyPart.RightOblique)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightOblique) : undefined}
                    />

                    <Path
                        d={frontLeftOblique}
                        fill={
                            getFillColor(BodyPart.LeftOblique)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftOblique) : undefined}
                    />

                    <Path
                        d={frontLeftLowerAbs}
                        fill={getFillColor(
                            BodyPart.LeftLowerAbs
                        )}
                        // fill={
                        //     getFillColor(BodyPart.LeftLowerAbs)
                        //         ? "#d85108"
                        //         : 'grey'
                        // }
                        // onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftLowerAbs) : undefined}
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftLowerAbs) : undefined}
                    />

                    <Path
                        d={frontRightLowerAbs}
                        fill={
                            getFillColor(BodyPart.RightLowerAbs)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightLowerAbs) : undefined}
                    />

                    <Path
                        d={frontRightForearm}
                        fill={
                            getFillColor(BodyPart.RightForearm)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightForearm) : undefined}
                    />

                    <Path
                        d={frontLeftForearm}
                        fill={
                            getFillColor(BodyPart.LeftForearm)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftForearm) : undefined}
                    />


                    <Path
                        d={frontRightAdductor}
                        fill={
                            getFillColor(BodyPart.RightAdductor)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightAdductor) : undefined}
                    />


                    <Path
                        d={frontLeftAdductor}
                        fill={
                            getFillColor(BodyPart.LeftAdductor)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftAdductor) : undefined}
                    />

                    <Path
                        d={frontRightQuad}
                        fill={
                            getFillColor(BodyPart.RightQuad)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightQuad) : undefined}
                    />

                    <Path
                        d={frontLeftQuad}
                        fill={
                            getFillColor(BodyPart.LeftQuad)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftQuad) : undefined}
                    />

                    <Path
                        d={frontLeftKnee}
                        fill={
                            getFillColor(BodyPart.LeftKnee)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftKnee) : undefined}
                    />

                    <Path
                        d={frontRightKnee}
                        fill={
                            getFillColor(BodyPart.RightKnee)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightKnee) : undefined}
                    />

                    <Path
                        d={frontLeftCalf}
                        fill={
                            getFillColor(BodyPart.LeftCalf)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftCalf) : undefined}
                    />

                    <Path
                        d={frontRightCalf}
                        fill={
                            getFillColor(BodyPart.RightCalf)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightCalf) : undefined}
                    />

                    <Path
                        d={frontLeftAnkle}
                        fill={
                            getFillColor(BodyPart.LeftAnkle)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftAnkle) : undefined}
                    />

                    <Path
                        d={frontRightAnkle}
                        fill={
                            getFillColor(BodyPart.RightAnkle)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightAnkle) : undefined}
                    />

                    <Path
                        d={frontLeftFoot}
                        fill={
                            getFillColor(BodyPart.LeftFoot)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftFoot) : undefined}
                    />

                    <Path
                        d={frontRightFoot}
                        fill={
                            getFillColor(BodyPart.RightFoot)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightFoot) : undefined}
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
                            getFillColor(BodyPart.RightBackShoulder)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightBackShoulder) : undefined}
                    />

                    <Path
                        d={backLeftShoulder}
                        fill={
                            getFillColor(BodyPart.LeftBackShoulder)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftBackShoulder) : undefined}
                    />

                    <Path
                        d={backRightUpperBack}
                        fill={
                            getFillColor(BodyPart.RightUpperBack)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightUpperBack) : undefined}
                    />

                    <Path
                        d={backLeftUpperBack}
                        fill={
                            getFillColor(BodyPart.LeftUpperBack)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftUpperBack) : undefined}
                    />

                    <Path
                        d={backLeftLowerBack}
                        fill={
                            getFillColor(BodyPart.LeftLowerBack)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftLowerBack) : undefined}
                    />

                    <Path
                        d={backRightLowerBack}
                        fill={
                            getFillColor(BodyPart.RightLowerBack)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightLowerBack) : undefined}
                    />

                    <Path
                        d={backRightForearm}
                        fill={
                            getFillColor(BodyPart.BackRightForearm)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.BackRightForearm) : undefined}
                    />

                    <Path
                        d={backLeftForearm}
                        fill={
                            getFillColor(BodyPart.BackLeftForearm)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.BackLeftForearm) : undefined}
                    />

                    <Path
                        d={backLeftGlute}
                        fill={
                            getFillColor(BodyPart.LeftGlute)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftGlute) : undefined}
                    />

                    <Path
                        d={backRightGlute}
                        fill={
                            getFillColor(BodyPart.RightGlute)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightGlute) : undefined}
                    />

                    <Path
                        d={backLeftHamstring}
                        fill={
                            getFillColor(BodyPart.LeftHamstring)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.LeftHamstring) : undefined}
                    />

                    <Path
                        d={backRightHamstring}
                        fill={
                            getFillColor(BodyPart.RightHamstring)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.RightHamstring) : undefined}
                    />

                    <Path
                        d={backRightCalf}
                        fill={
                            getFillColor(BodyPart.BackRightCalf)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.BackRightCalf) : undefined}
                    />

                    <Path
                        d={backLeftCalf}
                        fill={
                            getFillColor(BodyPart.BackLeftCalf)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.BackLeftCalf) : undefined}
                    />

                    <Path
                        d={backLeftAnkle}
                        fill={
                            getFillColor(BodyPart.BackLeftAnkle)

                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.BackLeftAnkle) : undefined}
                    />

                    <Path
                        d={backRightAnkle}
                        fill={
                            getFillColor(BodyPart.BackRightAnkle)
                                
                        }
                        onPress={mode === 'checkin' ? () => togglePart(BodyPart.BackRightAnkle) : undefined}
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

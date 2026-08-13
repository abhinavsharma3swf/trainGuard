import { Pressable, StyleSheet, Text } from 'react-native';

type TrainingLoadCircleProps = {
    score: number;
    onPress: () => void;
};

export function TrainingLoadCircle({
                                       score,
                                       onPress,
                                   }: TrainingLoadCircleProps) {

    const getColor = () => {
        if (score < 300) return '#4CAF50';
        if (score < 600) return '#FFC107';
        return '#F44336';
    };

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.circle,
                {
                    backgroundColor: getColor(),
                },
            ]}
        >
            <Text style={styles.score}>
                sRPE {score}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    circle: {
        width: 52,
        height: 52,
        borderRadius: 26,

        justifyContent: 'center',
        alignItems: 'center',
    },

    score: {
        fontSize: 15,
        fontWeight: '800',
        color: '#ffffff',
    },
});
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "@screens/App";
import {ConfigPage} from "@screens/Config";
import {PriceCalculator} from "@screens/CalcPrice";
import {RaceRecordPage} from "@screens/RaceRecord";
import {NewRaceModal} from "@screens/NewRaceModal";
import {createStaticNavigation} from "@react-navigation/native";
import {GeoSelectionModal} from "@screens/GeoSelectModal";
import {EditRaceModal} from "@screens/EditRaceModal";

const modal = createNativeStackNavigator({
    screenOptions: {
        presentation: 'modal',
    },
    screens: {
        GeoSelectionModal: {
            screen: GeoSelectionModal,
        },
        NewRace: {
            screen: NewRaceModal,
            options: {
                title: "Nova Corrida",
            },
        },
        EditRace: {
            screen: EditRaceModal,
            options: {
                title: "Editar Corrida",
            }
        }
    }
})
const home = createNativeStackNavigator({
    initialRouteName: "Home",
    screens: {
        Home: {
            screen: HomeScreen,
            options: {
                title: "Início",
            },
        },
        Config: {
            screen: ConfigPage,
            options: {
                title: "Configurações",
            },
        },
        CalcPrice: {
            screen: PriceCalculator,
            options: {
                title: "Calculadora de Preço"
            },
        },
        RaceRecord: {
            screen: RaceRecordPage,
            options: {
                title: "Histórico de Corridas",
            }
        },
    },

})
const RootStack = createNativeStackNavigator({
    screens: {
        App: {
            screen: home,
            options: {
                headerShown: false,
            }
        },
        Modal: {
            screen: modal,
            options: {
                headerShown: false,
            }
        },
    }
});

const Navigation = createStaticNavigation(RootStack);
export default Navigation;
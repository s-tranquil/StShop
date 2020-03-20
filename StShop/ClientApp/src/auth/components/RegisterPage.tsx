import * as React from "react";

import { useForm } from "react-hook-form";
import {
    Map,
    Marker,
    Popup,
    TileLayer,
    withLeaflet
} from "react-leaflet";
import { ReactLeafletSearch } from "react-leaflet-search";
import {
    Alert,
    Button,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label
} from "reactstrap";
import { nameof } from "ts-simple-nameof";

import { emailRegexp } from "../../constants";

import { Address } from "../../models/address";
import { RegisterModel } from "../../models/register-model";

const fieldNames = {
    email: nameof<RegisterModel>(x => x.email),
    name: nameof<RegisterModel>(x => x.name),
    surname: nameof<RegisterModel>(x => x.surname),
    password: nameof<RegisterModel>(x => x.password),
    address: nameof<RegisterModel>(x => x.address),
    displayAddress: nameof<RegisterModel>(x => x.displayAddress)
};

const RegisterPage: React.FC = () => {
    const { register, handleSubmit, errors } = useForm();
    const [state, setState] = React.useState<RegisterModel>({
        email: "",
        name: "",
        password: "",
        surname: "",
        displayAddress: "",
        address: {} as Address
    });
    const [error, setError] = React.useState<boolean>(false);
    const showError = React.useCallback(
        () => {
            setError(true);
            setTimeout(() => setError(false), 5000);
        },
        [setError]
    );

    const [success, setSuccess] = React.useState<boolean>(false);
    const showSuccess = React.useCallback(
        () => {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
        },
        [setSuccess]
    );

    const setStatePartial = React.useCallback(
        (newProps: Partial<RegisterModel>) => 
            setState((prevState) => ({
                ...prevState,
                ...newProps
            })),
        [setState]
    );

    React.useEffect(
        () => {
            async function fetchRegisterModel() {
                const response = await fetch("account/register");
                if (!response.ok) {
                    return;
                }

                const model: RegisterModel = await response.json();
                if (model && model.email) {
                    // cause controlled input does not like null values
                    model.password = "";
                    setState(model);
                }
            }
            fetchRegisterModel();
        },
        [setState]
    );

    const onSubmit = React.useCallback(
        () => {
            async function postRegisterModel() {
                const response = await fetch(
                    "account/register",
                    {
                        method: "POST",
                        cache: "no-cache",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(state)
                    }
                );
                if (response.ok) {
                    showSuccess();
                } else {
                    showError();
                }

                const model: RegisterModel = await response.json();
                if (model && model.email) {
                    setState(model);
                }
            };

            postRegisterModel();
        },
        [setState, state, showError, showSuccess]
    );


    const SearchComponent = React.useMemo(
        () => {
            // good old monkey-patching
            // I wish it was another way...
            const originalLatLngHandler = ReactLeafletSearch.prototype.latLngHandler;
            ReactLeafletSearch.prototype.latLngHandler = function (...props: Parameters<ReactLeafletSearch["latLngHandler"]>) {
                // getting our address from raw osm response array
                const latLng = props[0];
                const rawInfos = (props[2] as any).raw as any[];
                const rawInfo = rawInfos
                    .find(x => 
                        x.lat == latLng.lat && 
                        x.lon == latLng.lng
                    );
                const rawAddress = rawInfo.address;

                // making sure that it's a house
                if ("house_number" in rawAddress) {
                    setStatePartial({
                        displayAddress: rawInfo.display_name,
                        address: {
                            country: rawAddress.country,
                            city: rawAddress.city,
                            street: rawAddress.road,
                            house: rawAddress.house_number,
                            zipCode: rawAddress.postcode
                        }
                    });
                }
                // calling the original handler
                originalLatLngHandler.apply(this, props);
            }

            return withLeaflet(ReactLeafletSearch);
        },
        [setStatePartial]
    );

    const handleEmailChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setStatePartial({ email: e.target.value }), 
        [setStatePartial]
    );

    const handleNameChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setStatePartial({ name: e.target.value }), 
        [setStatePartial]
    );

    const handleSurnameChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setStatePartial({ surname: e.target.value }), 
        [setStatePartial]
    );

    const handlePasswordChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setStatePartial({ password: e.target.value }), 
        [setStatePartial]
    );
    
    return (
        <div>
            <h1>Register Page</h1>

            {success && (
                <Alert color="success">
                    Register information successfully updated
                </Alert>
            )}
            {error && (
                <Alert color="danger">
                    There was an error updating register information
                </Alert>
            )}

            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormGroup>
                    <Label htmlFor={fieldNames.email}>Email</Label>
                    <Input
                        name={fieldNames.email}
                        innerRef={register({ required: true, pattern: emailRegexp })}
                        value={state.email}
                        onChange={handleEmailChange}
                        invalid={!!errors[fieldNames.email]}
                    />
                    {errors[fieldNames.email] && <FormFeedback>Enter a valid email</FormFeedback>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor={fieldNames.name}>Name</Label>
                    <Input
                        name={fieldNames.name}
                        innerRef={register({ required: true })} 
                        value={state.name}
                        onChange={handleNameChange}
                        invalid={!!errors[fieldNames.name]}
                    />
                    {errors[fieldNames.name] && <FormFeedback>Enter your name</FormFeedback>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor={fieldNames.surname}>Surname</Label>
                    <Input
                        name={fieldNames.surname}
                        innerRef={register({ required: true })} 
                        value={state.surname}
                        onChange={handleSurnameChange}
                        invalid={!!errors[fieldNames.surname]}
                    />
                    {errors[fieldNames.surname] && <FormFeedback>Enter your surname</FormFeedback>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor={fieldNames.displayAddress}>Address</Label>
                    <Input
                        name={fieldNames.displayAddress}
                        innerRef={register({ required: true })}
                        readOnly={true}
                        value={state.displayAddress}
                        placeholder="Input your address into the text field on the map"
                        invalid={!!errors[fieldNames.displayAddress]}
                    />
                    {errors[fieldNames.displayAddress] && <FormFeedback>Enter your address</FormFeedback>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor={fieldNames.password}>Choose a password</Label>
                    <Input
                        name={fieldNames.password}
                        type="password"
                        innerRef={register({ required: true, minLength: 2 })}
                        value={state.password}
                        onChange={handlePasswordChange}
                        invalid={!!errors[fieldNames.password]}
                    />
                    {errors[fieldNames.password] && <FormFeedback>Enter a password</FormFeedback>}
                </FormGroup>

                <Button>Submit</Button>
            </Form>

            <div>
                <Map
                    center={[50, 10]}
                    zoom={6}
                    maxZoom={16}
                    attributionControl={true}
                    zoomControl={true}
                    doubleClickZoom={true}
                    scrollWheelZoom={true}
                    dragging={true}
                    animate={true}
                    easeLinearity={0.35}
                >
                    <TileLayer
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />
                    <SearchComponent
                        position='topleft'
                        zoom={16}
                        showMarker={true}
                        showPopup={true}
                        closeResultsOnClick={true}
                        openSearchOnLoad={true}
                    />
                    <Marker position={[50, 10]}>
                    <Popup>
                        Popup for any custom information.
                    </Popup>
                    </Marker>
                </Map>
            </div>
        </div>
    )
};

export { RegisterPage };

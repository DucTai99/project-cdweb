import React, { Component } from "react";
import log from "loglevel";
import { MenuItem, Grid } from "@material-ui/core";
import ContinueButton from "./continueButton";
import { withStyles } from "@material-ui/core/styles";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { stateCodes } from "../../../constants/stateCodes";
import { setShippingAddress } from "../../../actions";
import { ModalConfirmation } from "../../ui/modalConfirmation";
import { SummaryCard } from "./summaryCard";
import { checkoutFormStyles } from "../../../styles/materialUI/checkoutFormStyles";
import { renderReduxTextField } from "../../ui/reduxTextField";

class ShippingAddressForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressRemovalConfirmation: false,
    };
  }

  closeModalHandler = () => {
    this.setState({ addressRemovalConfirmation: false });
  };

  removeConfirmedHandler = () => {
    this.props.reset("shippingAddressForm");
    this.props.setShippingAddress({ submitted: false });
    this.setState({ addressRemovalConfirmation: false });
  };

  handleSubmit = () => {
    log.info(
      `[ShippingAddress] values = ${JSON.stringify(
        this.props.shippingAddressFormStore
      )}`
    );
    // let formValues = this.props.signUpFormStore.values
    // let id = `${formValues.firstName}-${formValues.lastName}-${Math.floor(Date.now() / 1000)}`

    this.props.setShippingAddress({ submitted: true });
  };

  editBtnHandler = () => {
    this.props.setShippingAddress({ submitted: false });
  };

  deleteBtnHandler = () => {
    this.setState({ addressRemovalConfirmation: true });
  };

  render() {
    const { classes, submitting, pristine } = this.props;

    const renderShippingSummaryAddresses = () => {
      let formValues = this.props.shippingAddressFormStore.values;
      let contentList = [
        `${formValues.firstName} ${formValues.lastName}`,
        formValues.addressLine1,
        formValues.email,
        formValues.phoneNumber,
      ];

      return (
        <Grid
          container
          justify="flex-start"
          style={{ height: "fit-content", backgroundColor: "#80808033" }}
        >
          <SummaryCard
            contentList={contentList}
            editBtnHandler={this.editBtnHandler}
            deleteBtnHandler={this.deleteBtnHandler}
          />
        </Grid>
      );
    };

    const renderFormTextField = (label, name, valueText) => {
      return (
        <Grid item container xs={11} sm={8}>
          <Field
            name={name}
            component={renderReduxTextField}
            label={label}
            valueText={valueText}
          />
        </Grid>
      );
    };

    const renderShippingForm = () => {
      return (
        <Grid item style={{ width: "100%", height: "fit-content" }}>
          <Grid item xs={12}>
            <form
              onSubmit={this.handleSubmit}
              className={classes.root}
              style={{ width: "inherit" }}
            >
              {renderFormTextField(
                "First Name",
                "firstName",
                this.props.firstName
              )}
              {renderFormTextField(
                "Last Name",
                "lastName",
                this.props.lastName
              )}
              {renderFormTextField("Email", "email", this.props.email)}
              {renderFormTextField(
                "Address",
                "addressLine1"
                // this.props.addressLine1
              )}
              {renderFormTextField(
                "Phone Number",
                "phoneNumber"
                // this.props.phoneNumber
              )}

              <ContinueButton type="submit" action={submitting || pristine} />
            </form>
          </Grid>
        </Grid>
      );
    };

    log.info(`[ShippingAddress] Rendering ShippingAddress Component...`);

    return (
      <>
        {this.props.shippingAddress.submitted
          ? renderShippingSummaryAddresses()
          : renderShippingForm()}

        {this.state.addressRemovalConfirmation ? (
          <ModalConfirmation
            closeModalHandler={this.closeModalHandler}
            removeConfirmedHandler={this.removeConfirmedHandler}
            title="Remove Address"
            question="Are you sure you want to remove selected address?"
          />
        ) : null}
      </>
    );
  }
}

const validate = (formValues) => {
  const errors = {};
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "addressLine1",
    "phoneNumber",
  ];
  requiredFields.forEach((field) => {
    if (!formValues[field]) {
      errors[field] = "Required";
    }
  });

  if (
    formValues.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)
  ) {
    errors.email = "Invalid email address";
  }

  if (
    formValues.phoneNumber &&
    !/^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/.test(
      formValues.phoneNumber
    )
  ) {
    errors.phoneNumber = "Invalid Phone Number";
  }
  return errors;
};

const mapStateToProps = (state) => {
  return {
    shippingAddressFormStore: state.form.shippingAddressForm
      ? state.form.shippingAddressForm
      : null,
    shippingAddress: state.shippingAddressReducer,
    id: state.signInReducer.id ? state.signInReducer.id : "",
    email: state.signInReducer.email
      ? state.signInReducer.email
      : state.form.shippingAddressForm.values.email,
    firstName: state.signInReducer.firstName
      ? state.signInReducer.firstName
      : state.form.shippingAddressForm.values.firstName,
    lastName: state.signInReducer.lastName
      ? state.signInReducer.lastName
      : state.form.shippingAddressForm.values.lastName,
    userName: state.signInReducer.userName ? state.signInReducer.userName : "",
    // phoneNumber: state.form
    //   ? state.form.shippingAddressForm.values.phoneNumber
    //   : "",
    // addressLine1: state.form
    //   ? state.form.shippingAddressForm.values.addressLine1
    //   : "",
  };
};

const reduxWrapperForm = reduxForm({
  form: "shippingAddressForm",
  destroyOnUnmount: false,
  validate,
})(ShippingAddressForm);

const connectWrapperForm = connect(mapStateToProps, { setShippingAddress })(
  reduxWrapperForm
);

export default withStyles(checkoutFormStyles, { withTheme: true })(
  connectWrapperForm
);

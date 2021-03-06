import React, { Component } from 'react';

import {
  firestore,
  FirebaseContext,
  createTicketDocument
} from '../../firebase/firebase';

import {
  descriptionOptionsHFC,
  descriptionOptionsGPON,
  tvPackageOptions,
  internetPackageOptions
} from '../../utils/select-lists';

// Component imports
import Spinner from '../../components/spinner/Spinner';
import EquipmentFieldGroup from '../../components/equipment-field-group/EquipmentFieldGroup';
import SelectListGroup from '../../components/select-list-group/SelectListGroup';
import TextFieldGroup from '../../components/text-field-group/TextFieldGroup';

class EditTicket extends Component {
  static contextType = FirebaseContext;

  state = {
    ticketLoading: false,
    ticketType: '',
    provider: '',
    description: '',
    tvPackage: '',
    internetPackage: '',
    name: '',
    accountNumber: '',
    nin: '',
    address: '',
    parcelNumber: '',
    telephone1: '',
    telephone2: '',
    telephone3: '',
    email: '',
    nodeLocation: '',
    tnaLocation: '',
    le: '',
    tap: false,
    dB: '',
    psLocation: '',
    hubLocation: '',
    phone: false,
    phoneMac: '',
    phoneSerial: '',
    iptv: false,
    iptvMac: '',
    iptvSerial: '',
    vod: false,
    vodMac: '',
    vodSerial: '',
    dualView: false,
    dualViewMac: '',
    dualViewSerial: '',
    stbPet: false,
    stbPetMac: '',
    stbPetSerial: '',
    stbNeta: false,
    stbNetaMac: '',
    stbNetaSerial: '',
    ont2426: false,
    ont2426Mac: '',
    ont2426Serial: '',
    ont2424: false,
    ont2424Mac: '',
    ont2424Serial: '',
    technoColour: false,
    technoColourMac: '',
    technoColourSerial: '',
    errors: {}
  };

  componentDidMount() {
    const { currentUser } = this.context;
    const { match, history } = this.props;

    if (currentUser) {
      this.getTicket();

      const { role, company } = currentUser;

      if (role === 'technician') {
        return history.push('/dashboard');
      }

      if (role === 'provider' && match.params.provider !== company) {
        return history.push('/dashboard');
      }
    } else {
      return history.push('/login');
    }
  }

  componentDidUpdate() {
    if (!this.context.currentUser) {
      return this.props.history.push('/login');
    }
  }

  getTicket = async () => {
    this.setState({ ticketLoading: true });

    const ticketRef = firestore.doc(
      `/providers/${this.props.match.params.provider}/tickets/${
        this.props.match.params.id
      }`
    );

    const snapshot = await ticketRef.get();
    if (snapshot.exists) {
      const ticket = snapshot.data();
      console.log(ticket);

      const {
        ticketType = '',
        provider = '',
        description = '',
        tvPackage = '',
        internetPackage = '',
        endUserInfo: {
          name = '',
          accountNumber = '',
          nin = '',
          address = '',
          parcelNumber = '',
          telephone1 = '',
          telephone2 = '',
          telephone3 = '',
          email = ''
        } = {},
        networkInfo: {
          nodeLocation = '',
          tnaLocation = '',
          le = '',
          tap = false,
          dB = '',
          psLocation = '',
          hubLocation = ''
        } = {},
        equipment: {
          phone = false,
          phoneMac = '',
          phoneSerial = '',
          iptv = false,
          iptvMac = '',
          iptvSerial = '',
          vod = false,
          vodMac = '',
          vodSerial = '',
          dualView = false,
          dualViewMac = '',
          dualViewSerial = '',
          stbPet = false,
          stbPetMac = '',
          stbPetSerial = '',
          stbNeta = false,
          stbNetaMac = '',
          stbNetaSerial = '',
          ont2426 = false,
          ont2426Mac = '',
          ont2426Serial = '',
          ont2424 = false,
          ont2424Mac = '',
          ont2424Serial = '',
          technoColour = false,
          technoColourMac = '',
          technoColourSerial = ''
        } = {}
      } = ticket;

      this.setState({
        ticketLoading: false,
        ticketType,
        provider,
        description,
        tvPackage,
        internetPackage,
        name,
        accountNumber,
        nin,
        address,
        parcelNumber,
        telephone1,
        telephone2,
        telephone3,
        email,
        nodeLocation,
        tnaLocation,
        le,
        tap,
        dB,
        psLocation,
        hubLocation,
        phone,
        phoneMac,
        phoneSerial,
        iptv,
        iptvMac,
        iptvSerial,
        vod,
        vodMac,
        vodSerial,
        dualView,
        dualViewMac,
        dualViewSerial,
        stbPet,
        stbPetMac,
        stbPetSerial,
        stbNeta,
        stbNetaMac,
        stbNetaSerial,
        ont2426,
        ont2426Mac,
        ont2426Serial,
        ont2424,
        ont2424Mac,
        ont2424Serial,
        technoColour,
        technoColourMac,
        technoColourSerial
      });
    } else {
      this.props.history.push('/not-found');
    }
  };

  onSubmit = event => {
    event.preventDefault();

    const ticketData = this.state;
    ticketData.uid = this.props.match.params.id;

    const { description } = this.state;

    if (!description) {
      return this.setState({
        errors: { description: 'Please select a description' }
      });
    }

    const { currentUser } = this.context;

    createTicketDocument(ticketData, currentUser).then(() =>
      this.props.history.push(
        `/ticket/${ticketData.provider}/${ticketData.uid}`
      )
    );
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onCheck = event => {
    const { name } = event.target;
    this.setState({ [name]: !this.state[name] });
  };

  render() {
    const { ticket, ticketLoading, errors, ticketType } = this.state;

    let ticketForm;

    if (ticket === null || ticketLoading) {
      ticketForm = <Spinner />;
    } else {
      if (ticketType) {
        ticketForm = (
          <form onSubmit={this.onSubmit}>
            <SelectListGroup
              name="description"
              value={this.state.description}
              onChange={this.onChange}
              placeholderOption="Ticket Description *"
              items={
                ticketType === 'HFC'
                  ? descriptionOptionsHFC
                  : descriptionOptionsGPON
              }
              fieldLabel={
                this.state.description !== '' && 'Ticket Description:'
              }
              error={errors.description}
              required
            />
            <SelectListGroup
              name="tvPackage"
              value={this.state.tvPackage}
              onChange={this.onChange}
              placeholderOption="Select TV Subscription"
              items={tvPackageOptions}
              fieldLabel={this.state.tvPackage !== '' && 'TV Subscription:'}
              error={errors.tvPackage}
            />
            <SelectListGroup
              name="internetPackage"
              value={this.state.internetPackage}
              onChange={this.onChange}
              placeholderOption="Select Internet Subscription"
              items={internetPackageOptions}
              fieldLabel={
                this.state.internetPackage !== '' && 'Internet Subscription:'
              }
              error={errors.internetPackage}
            />
            <br />
            <p className="lead">End User Information:</p>
            <TextFieldGroup
              placeholder="Customer Name *"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              label={this.state.name !== '' && 'Customer Name:'}
              error={errors.name}
              required
            />
            <TextFieldGroup
              placeholder="Account Number *"
              name="accountNumber"
              value={this.state.accountNumber}
              onChange={this.onChange}
              label={this.state.accountNumber !== '' && 'Account Number:'}
              error={errors.accountNumber}
              required
            />
            <TextFieldGroup
              placeholder="NIN *"
              name="nin"
              value={this.state.nin}
              onChange={this.onChange}
              label={this.state.nin !== '' && 'NIN:'}
              error={errors.nin}
              required
            />
            <TextFieldGroup
              placeholder="Address *"
              name="address"
              value={this.state.address}
              onChange={this.onChange}
              label={this.state.address !== '' && 'Address:'}
              error={errors.address}
              required
            />
            <TextFieldGroup
              placeholder="Parcel Number *"
              name="parcelNumber"
              value={this.state.parcelNumber}
              onChange={this.onChange}
              label={this.state.parcelNumber !== '' && 'Parcel Number:'}
              error={errors.parcelNumber}
              required
            />
            <label className="text-muted">Telephone Number(s):</label>
            <div className="row">
              <div className="col-10">
                <TextFieldGroup
                  placeholder="Telephone *"
                  name="telephone1"
                  value={this.state.telephone1}
                  onChange={this.onChange}
                  error={errors.telephone1}
                  required
                />
              </div>
              <div className="col-2">
                <button className="btn btn-secondary btn-block" disabled>
                  <i className="fas fa-plus" />
                </button>
              </div>
              <div className="col-10">
                <TextFieldGroup
                  placeholder="Telephone 2 (Optional)"
                  name="telephone2"
                  value={this.state.telephone2}
                  onChange={this.onChange}
                  error={errors.telephone2}
                />
              </div>
              <div className="col-2">
                <button className="btn btn-secondary btn-block" disabled>
                  <i className="fas fa-plus" />
                </button>
              </div>
              <div className="col-12">
                <TextFieldGroup
                  placeholder="Telephone 3 (Optional)"
                  name="telephone3"
                  value={this.state.telephone3}
                  onChange={this.onChange}
                  error={errors.telephone3}
                />
              </div>
            </div>
            <TextFieldGroup
              placeholder="Email"
              name="email"
              type="email"
              value={this.state.email}
              onChange={this.onChange}
              label={this.state.email !== '' && 'Email:'}
              error={errors.email}
            />
            <br />
            <p className="lead">Network Information:</p>
            <TextFieldGroup
              placeholder="Node Location"
              name="nodeLocation"
              value={this.state.nodeLocation}
              onChange={this.onChange}
              label={this.state.nodeLocation !== '' && 'Node Location:'}
              error={errors.nodeLocation}
            />
            <TextFieldGroup
              placeholder="T.N.A. Location"
              name="tnaLocation"
              value={this.state.tnaLocation}
              onChange={this.onChange}
              label={this.state.tnaLocation !== '' && 'T.N.A. Location:'}
              error={errors.tnaLocation}
            />
            <TextFieldGroup
              placeholder="L.E."
              name="le"
              value={this.state.le}
              onChange={this.onChange}
              label={this.state.le !== '' && 'L.E.:'}
              error={errors.le}
            />
            <div className="row">
              <div className="col-2 form-check pl-5 mt-1">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="tap"
                  value={this.state.tap}
                  checked={this.state.tap}
                  onChange={this.onCheck}
                  id="tap"
                />
                <label htmlFor="tap" className="text-muted form-check-label">
                  Tap
                </label>
              </div>
              <div className="col-10">
                <TextFieldGroup
                  placeholder="dB"
                  name="dB"
                  value={!this.state.tap ? '' : this.state.dB}
                  onChange={this.onChange}
                  disabled={!this.state.tap && true}
                  error={errors.dB}
                />
              </div>
            </div>
            <TextFieldGroup
              placeholder="P.S. Location"
              name="psLocation"
              value={this.state.psLocation}
              onChange={this.onChange}
              label={this.state.psLocation !== '' && 'P.S. Location:'}
              error={errors.psLocation}
            />
            <TextFieldGroup
              placeholder="Hub Location"
              name="hubLocation"
              value={this.state.hubLocation}
              onChange={this.onChange}
              label={this.state.hubLocation !== '' && 'Hub Location:'}
              error={errors.hubLocation}
            />
            <br />
            <p className="lead">Equipment:</p>
            <EquipmentFieldGroup
              name="phone"
              nameMac="phoneMac"
              nameSerial="phoneSerial"
              value={this.state.phone}
              valueMac={this.state.phoneMac}
              valueSerial={this.state.phoneSerial}
              label="Phone"
              onCheck={this.onCheck}
              onChange={this.onChange}
            />
            <EquipmentFieldGroup
              name="iptv"
              nameMac="iptvMac"
              nameSerial="iptvSerial"
              value={this.state.iptv}
              valueMac={this.state.iptvMac}
              valueSerial={this.state.iptvSerial}
              label="IPTV"
              onCheck={this.onCheck}
              onChange={this.onChange}
            />
            <EquipmentFieldGroup
              name="vod"
              nameMac="vodMac"
              nameSerial="vodSerial"
              value={this.state.vod}
              valueMac={this.state.vodMac}
              valueSerial={this.state.vodSerial}
              label="VOD"
              onCheck={this.onCheck}
              onChange={this.onChange}
            />
            <EquipmentFieldGroup
              name="dualView"
              nameMac="dualViewMac"
              nameSerial="dualViewSerial"
              value={this.state.dualView}
              valueMac={this.state.dualViewMac}
              valueSerial={this.state.dualViewSerial}
              label="Dual View"
              onCheck={this.onCheck}
              onChange={this.onChange}
            />
            <EquipmentFieldGroup
              name="stbPet"
              nameMac="stbPetMac"
              nameSerial="stbPetSerial"
              value={this.state.stbPet}
              valueMac={this.state.stbPetMac}
              valueSerial={this.state.stbPetSerial}
              label="STB PET"
              onCheck={this.onCheck}
              onChange={this.onChange}
            />
            <EquipmentFieldGroup
              name="stbNeta"
              nameMac="stbNetaMac"
              nameSerial="stbNetaSerial"
              value={this.state.stbNeta}
              valueMac={this.state.stbNetaMac}
              valueSerial={this.state.stbNetaSerial}
              label="STB NETA"
              onCheck={this.onCheck}
              onChange={this.onChange}
            />
            <EquipmentFieldGroup
              name="ont2426"
              nameMac="ont2426Mac"
              nameSerial="ont2426Serial"
              value={this.state.ont2426}
              valueMac={this.state.ont2426Mac}
              valueSerial={this.state.ont2426Serial}
              label="ONT 2426"
              onCheck={this.onCheck}
              onChange={this.onChange}
            />
            <EquipmentFieldGroup
              name="ont2424"
              nameMac="ont2424Mac"
              nameSerial="ont2424Serial"
              value={this.state.ont2424}
              valueMac={this.state.ont2424Mac}
              valueSerial={this.state.ont2424Serial}
              label="ONT 2424"
              onCheck={this.onCheck}
              onChange={this.onChange}
            />
            <EquipmentFieldGroup
              name="technoColour"
              nameMac="technoColourMac"
              nameSerial="technoColourSerial"
              value={this.state.technoColour}
              valueMac={this.state.technoColourMac}
              valueSerial={this.state.technoColourSerial}
              label="Techno Colour"
              onCheck={this.onCheck}
              onChange={this.onChange}
            />
            <input type="submit" className="btn btn-info btn-block mt-4" />
          </form>
        );
      }
    }

    return (
      <div className="create-ticket">
        <div className="container">
          <div className="row mt-4">
            <div className="col-md-12">
              <button
                onClick={() => this.props.history.goBack()}
                className="btn btn-light mb-2"
              >
                Go Back
              </button>
            </div>
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Edit Ticket</h1>
              <p className="lead text-center">
                Use the form below to modify ticket details and submit
              </p>
              <small className="d-block pb-3 text-center">
                * indicates required fields
              </small>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 m-auto">
              {this.state.ticketType !== '' && (
                <div>
                  <p className="lead">Change ticket type:</p>
                  <div className="btn-group" role="group">
                    <button
                      onClick={() =>
                        this.setState({ ticketType: 'HFC', description: '' })
                      }
                      className={`btn ${
                        this.state.ticketType === 'HFC'
                          ? 'btn-dark'
                          : 'btn-secondary'
                      } mb-3`}
                    >
                      HFC
                    </button>
                    <button
                      onClick={() =>
                        this.setState({ ticketType: 'GPON', description: '' })
                      }
                      className={`btn ${
                        this.state.ticketType === 'GPON'
                          ? 'btn-dark'
                          : 'btn-secondary'
                      } mb-3`}
                    >
                      GPON
                    </button>
                  </div>
                  <p className="lead">
                    Ticket type: <strong>{this.state.ticketType}</strong>
                  </p>
                </div>
              )}
              {ticketForm}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditTicket;

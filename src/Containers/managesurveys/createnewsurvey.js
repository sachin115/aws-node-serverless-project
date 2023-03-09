import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import useStyle from "../styles";
import { useUserDispatch, useUserState } from "../../Customutils/UserContext";
import callApi from "../../Customutils/callApi";
import Breadcrumb from "../../Components/Breadcrumbs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cookie from "react-cookies";
toast.configure();
const notify = () => toast("Session Expired...!");

const steps = ["Survey Details", "Survey Users "];

const CreateNewSurvey = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [surveyName, setSurveyName] = useState("");
  const [status, setStatus] = useState("");
  const [categories, setCategories] = useState([]);
  const [actionRequired, setActionRequired] = useState(false);
  const [mappedCategories, setMappedCategories] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const classes = useStyle();
  const handleNext = (event) => {
    event.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <>
      <Breadcrumb
        breadcrumbElements={[
          { label: "Survey", path: "/app/managesurvey" },
          { label: "Add" },
        ]}
      />
      <Paper elevation={0}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                className={
                  activeStep === index
                    ? classes.activeStep
                    : classes.inactiveStep
                }
              >
                {step}
              </StepLabel>
              <StepContent>
                {activeStep === 0 && (
                  <ValidatorForm onSubmit={handleNext}>
                    <Grid container spacing={2}>
                      <Grid item md={7} xs={12}>
                        <TextField
                          fullWidth
                          required
                          size="small"
                          label="Survey Name"
                          value={surveyName}
                          onChange={(event) => {
                            setSurveyName(event.target.value);
                          }}
                        />
                      </Grid>

                      <Grid
                        item
                        md={7}
                        xs={12}
                        className={classes.fieldContainer}
                      >
                        <FormControl fullWidth size="small" required>
                          <InputLabel>Status</InputLabel>
                          <Select
                            className={classes.selectClass}
                            required
                            MenuProps={{
                              PaperProps: {
                                style: { marginTop: 45 },
                              },
                            }}
                            value={status}
                            onChange={(event) => {
                              setStatus(event.target.value);
                            }}
                            label="Select Status"
                            fullWidth
                          >
                            <MenuItem value={"ACTIVE"}>ACTIVE</MenuItem>
                            <MenuItem value={"INACTIVE"}>INACTIVE</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item md={7} xs={12}>
                        <FormControl fullWidth size="small">
                          <Autocomplete
                            value={mappedCategories}
                            onChange={(event, newValue) => {
                              setMappedCategories(newValue);
                            }}
                            multiple
                            id="tags-outlined"
                            options={categories}
                            getOptionLabel={(option) => option.name}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  variant="outlined"
                                  label={option.name}
                                  {...getTagProps(option)}
                                />
                              ))
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Category"
                                placeholder="search"
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        md={7}
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={actionRequired}
                              onChange={(event) => {
                                setActionRequired(event.target.checked);
                              }}
                              name="gilad"
                              color="primary"
                            />
                          }
                          label="Action Required"
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Box sx={{ mb: 2 }} className={classes.stepperButton}>
                          <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            color="primary"
                            style={{
                              marginRight: "11px",
                            }}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {index === steps.length - 1
                              ? "Finish"
                              : "Save & Continue"}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </ValidatorForm>
                )}
                {activeStep === 1 && (
                  <ValidatorForm onSubmit={handleNext}>
                    <Divider variant="middle" style={{ width: "98%" }} />
                    <Box sx={{ mb: 2 }} className={classes.stepperButton}>
                      <Button
                        onClick={handleBack}
                        size="small"
                        variant="outlined"
                        style={{
                          marginRight: "8px",
                        }}
                      >
                        Previous
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        color="primary"
                        style={{
                          marginRight: "11px",
                        }}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1
                          ? "Finish"
                          : "Save & Continue"}
                      </Button>
                    </Box>
                  </ValidatorForm>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Box component={"div"}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button
              color="inherit"
              variant="contained"
              disabled={isApiLoading}
              size="small"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Box className={classes.formButton}>
              <Button
                variant="contained"
                color="primary"
                disabled={isApiLoading}
                size="small"
                style={{
                  marginRight: "8px",
                }}
                onClick={() => {
                  console.log("API loading ....!");
                }}
              >
                Create
              </Button>
              {isApiLoading && (
                <CircularProgress
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "6%",
                  }}
                />
              )}
              <Button
                onClick={() => {
                  props.history.push("/app/dashboard");
                }}
                variant="contained"
                disabled={isApiLoading}
                color="secondary"
                size="small"
                style={{
                  marginRight: "11px",
                }}
              >
                CANCEL
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </>
  );
};

export default CreateNewSurvey;

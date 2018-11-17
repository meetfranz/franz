# Contributing to Franz 5

:tada: First off, thanks for taking the time and your effort to make Franz better! :tada:

#### Table of contents
<!-- TOC depthFrom:2 depthTo:2 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Code of Conduct](#code-of-conduct)
- [What should I know before I get started?](#what-should-i-know-before-i-get-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Styleguide](#styleguide)

<!-- /TOC -->

## Code of Conduct

This project and everyone participating in it is governed by the [Franz Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [stefan@adlk.io](mailto:stefan@adlk.io).

## What should I know before I get started?
With Franz 5, we have completely separated the client and the services. If you have any issues with a service recipe, please do not open an issue at this repository. Instead head over to the [Franz Recipe Repository](https://github.com/meetfranz/plugins) and open a new issue there.

If you need help with development, want to discuss a new feature or improvement please talk to us either on [Slack](http://slack.franz.im) or open a new issue with the [feature proposal template](.github/FEATURE_PROPOSAL_TEMPLATE.md).

## How Can I Contribute?
As a basic rule, before filing issues, feature requests or anything else. Take a look at the issues and check if this has not already been reported by another user. If so, engage in the already existing discussion.

## Styleguide
### Git Commit Messages
* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include `[ci skip]` in the commit description

### Javascript
* Please use `es-lint` and the defined rules to maintain a consistent style

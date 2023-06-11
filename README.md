# Monster's Inc. Room

A simple computer graphics application to showcase a 3D room from the Disney movie [Monsters, Inc.](https://www.pixar.com/feature-films/monsters-inc)

## Installation

After cloning the repository, `cd` into it and run `npm install` to install the required packages and dependencies.

## Usage

Run `npm run dev` to start a development server locally. It should automatically open the project in your default web browser. If it doesn't, navigate to [localhost at port 5173](http://localhost:5173/index.html) and you should see a colorful spinning cube.

## Scene

The project aims to model one of the rooms from the [Monsters, Inc.](https://www.pixar.com/feature-films/monsters-inc) movie. It features but is not limited to:

- Furniture (bed, nightstand, chair)
- Toys and household items
- Wall decals and room decor
- Flooring, carpet
- Doors and windows

Among other elements. Additionally, it features not only both light and shadow physics, but also animation and interactivity.

## Tech stack

[![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)

We chose to work with the [three.js](https://threejs.org/) JavaScript 3D Library given it has a really simple abstraction layer over the complicated WebGL programming API and its steep learning curve.

It is one of the most popular and stable WebGL libraries out there, with a vast feature set, good documentation, plenty examples to learn from, great performance and ease of learning.

Although [Unity](https://unity.com/) was also available, we wanted to focus on the scene and not on the physics that it could involve. This is why we chose to use a simple render engine rather than a full-fledged, all-in-one game engine like Unity.

## Contributors

- [Karen Hernández](https://github.com/karenhernandeze)
- [Santiago Alcérreca](https://github.com/santiadlv)

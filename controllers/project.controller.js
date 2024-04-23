import Project from '../models/project.model.js'
import createError from '../utils/createError.js'

export const createProject = async (req, res, next) => {
    if (!req.isSeller)
      return next(createError(403, "Only sellers can create a project!"));
  
    const newProject = new Project({
      userId: req.userId,
      ...req.body,
    });

    console.log(newProject)
  
    try {
      const savedProject = await newProject.save();
      console.log(savedProject)
      res.status(201).json(savedProject);
    } catch (error) {
      next(error);
    }
  }

export const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id)
        if (!project.userId === req.userId) return next(createError(403, 'You can only delete your own project.'))

        await Project.findByIdAndDelete(req.params.id)
        res.status(200).send('Project has been deleted.')
    } catch (error) {
        next(error)
    }    
}

export const getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id.toString())
        if(!project) return next(createError(404, 'Project not found.'))
        res.status(200).send(project)
    } catch (error) {
        next(error)
    }
}

export const getProjects = async (req, res, next) => {
    const q = req.query

                        // IF SEARCH FILTERS ARE USED ON FRONT-END
    const filters = {
        /**             FILTER BY QUERY
         * 1.  Spread the req.query
         * 2.  If the user is searching by <something>, filter by that <something>
         */
        ...(q.userId && { userId: q.userId }),
        ...(q.category && { category: q.category }),
         /**
         *              NESTED QUERY
         * 1.  Spread the req.query
         * 2.  If the user is searching by minimum or maximum price, 
         *      --spread subquery
         *      --filter by subquery
         */
        ...((q.min || q.max) && {
            price: { ...(q.min && { $gte: q.min }),
                     ...(q.max && { $lte: q.max }) }
            }),
        /**
         *              REGEX QUERY
         * 1.  Spread the req.query
         * 2.  If the user is searching titles by text 
         *      --spread use $regex to search
         *      --include <$options> to avoid case sensitive searches
         */
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    }

    try {
        const projects = await Project.find(filters).sort({ [q.sort]: -1 })
        res.status(200).send(projects)
    } catch (error) {
        next(error) 
    }
}


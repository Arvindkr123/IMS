import {createContext, useContext} from 'react'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useAuth} from '../../../modules/auth'
import axios from 'axios'

const BASE_URL = process.env.REACT_APP_BASE_URL
const CourseSubjectContext = createContext()

export const CourseSubjectContextProvider = ({children}) => {
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }

  const createCourseSubjectMutation = useMutation({
    mutationFn: async (data) => {
      try {
        return axios.post(`${BASE_URL}/api/subjects`, data, config).then((res) => res.data)
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },

    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      console.log('error')
    },

    onSuccess: () => {
      alert('Added Course Subject  Successfully!')
      //console.log('success')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCourseSubjectLists']})
      }
    },
  })

  const getCourseSubjectLists = useQuery({
    queryKey: ['getCourseSubjectLists'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/subjects`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const useSubjectsBasedOnCourse = (courseId) => {
    return useQuery({
      queryKey: ['getSubjectsBasedOnCourse', courseId],
      queryFn: async () => {
        const response = await axios.get(`${BASE_URL}/api/subjects/${courseId}`, config)
        // console.log(response)
        return response.data
      },
      enabled: !!courseId, // Only run the query if courseId is provided
    })
  }
  const useGetStudentSubjectsMarksBasedOnCourse = (studentId) => {
    return useQuery({
      queryKey: ['getStudentSubjectsMarksBasedOnCourse'],
      queryFn: async () => {
        const response = await axios.get(`${BASE_URL}/api/subjects/marks/${studentId}`, config)
        // console.log(response)
        return response.data
      },
    })
  }

  // update Course type
  const updateCourseCategoryMutation = useMutation({
    mutationFn: async (updateData) => {
      //console.log(updateData)
      return axios
        .put(`${BASE_URL}/api/subjects/${updateData._id}`, updateData, config) // Corrected order of arguments
        .then((res) => res.data)
    },
    onSettled: async (_, error, data) => {
      if (error) {
        alert('Error while updating student...', error)
      } else {
        // console.log('from course subject context ---->> ', data)
        await queryClient.invalidateQueries({queryKey: ['getCourseSubjectLists']})
      }
    },
  })

  // update Course type
  const updateCourseSubjectMarksMutation = useMutation({
    mutationFn: async (updateData) => {
      //console.log(updateData)
      return axios
        .post(`${BASE_URL}/api/subjects/marks`, updateData, config) // Corrected order of arguments
        .then((res) => res.data)
    },
    onSettled: async (_, error, data) => {
      if (error) {
        //alert('Error while updating student...', error)
      } else {
        // console.log('from course subject context ---->> ', data)
        await queryClient.invalidateQueries({
          queryKey: ['getStudentSubjectsMarksBasedOnCourse'],
        })
        // await queryClient.invalidateQueries({queryKey: ['getCourseSubjectLists', data._id]})
        //await queryClient.invalidateQueries({queryKey: ['getStudentSubjectsMarksBasedOnCourse']})
      }
    },
  })
  const updateStudentSubjectMarksMutation = useMutation({
    mutationFn: async (updateData) => {
      // console.log(updateData)
      return axios
        .put(
          `${BASE_URL}/api/subjects/marks/${updateData.studentId}/${updateData.marksId}`,
          updateData,
          config
        ) // Corrected order of arguments
        .then((res) => res.data)
    },
    onSettled: async (_, error, data) => {
      if (error) {
        //alert('Error while updating student...', error)
      } else {
        // console.log('from course subject context ---->> ', data)
        // await queryClient.invalidateQueries({queryKey: ['getCourseSubjectLists', data._id]})
        await queryClient.invalidateQueries({queryKey: ['getStudentSubjectsMarksBasedOnCourse']})
      }
    },
  })

  // delete subject course
  // Course Types
  const deleteCourseSubjectMutation = useMutation({
    mutationFn: (id) => {
      return axios.delete(`${BASE_URL}/api/subjects/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      //alert('Course subject deleted successfully')
    },
    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCourseSubjectLists']})
      }
    },
  })

  return (
    <CourseSubjectContext.Provider
      value={{
        createCourseSubjectMutation,
        getCourseSubjectLists,
        updateCourseCategoryMutation,
        deleteCourseSubjectMutation,
        useSubjectsBasedOnCourse,
        updateCourseSubjectMarksMutation,
        useGetStudentSubjectsMarksBasedOnCourse,
        updateStudentSubjectMarksMutation,
      }}
    >
      {children}
    </CourseSubjectContext.Provider>
  )
}

export const useCourseSubjectContext = () => {
  const context = useContext(CourseSubjectContext)
  if (!context) {
    throw new Error('useAdmissionContext must be used within an AdmissionContextProvider')
  }
  return context
}

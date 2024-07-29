import {createContext, useContext, useState} from 'react'
import axios from 'axios'
import {useQueryClient, useMutation, useQuery} from 'react-query'
import {useAuth} from '../../modules/auth'
import {toast} from 'react-toastify'
const StudentCourseFeeContext = createContext()

const BASE_URL = process.env.REACT_APP_BASE_URL

export const StudentCourseFeesContextProvider = ({children}) => {
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }

  function useSingleStudentCourseFees(studentId) {
    const result = useQuery({
      queryKey: ['getStudentCourseFeesLists', studentId],
      queryFn: async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/courseFees/studentFees/${studentId}`,
            config
          )
          return response.data
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })

    return result
  }
  function useGetStudentMonthlyCourseFeesCollection(companyId) {
    const result = useQuery({
      queryKey: ['getPaymentInstallmentCollectionFees'],
      queryFn: async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/courseFees/paymentInstallmentFees/${companyId}`,
            config
          )
          return response.data
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })

    return result
  }
  function useGetStudentMonthlyCourseFeesCollectionExpireationInstallment(searchData) {
    const result = useQuery({
      queryKey: ['getStudentCourseFeesLists'],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/courseFees/nextinstallment`, config)
          return response.data
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })

    return result
  }

  // const useDeleteSingleStudentCourseFees = useMutation({
  //   mutationKey: ['getStudentCourseFeesLists'],
  //   mutationFn: async (id) => {
  //     try {
  //       console.log(id)
  //       const response = await axios.delete(`${BASE_URL}/api/courseFees/${id}`, config)
  //       return response.data
  //     } catch (error) {
  //       throw new Error('Error fetching student data: ' + error.message)
  //     }
  //   },
  // })
  const useDeleteSingleStudentCourseFees = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${BASE_URL}/api/courseFees/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      alert('Course  deleted successfully')
    },
    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getStudentCourseFeesLists']})
      }
    },
  })

  //console.log(getStudentCourseData)

  //console.log(studentsLists)
  const createStudentCourseFeesMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/courseFees`, data, config).then((res) => res.data)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      console.log('error')
    },

    onSuccess: () => {
      //alert('Added Student  Course fee  Successfully!')
      //console.log('success')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getStudentCourseFeesLists'],
        })
      }
    },
  })

  // Course Types
  const deleteCourseMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${BASE_URL}/api/courses/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {
      alert('Course  deleted successfully')
    },
    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getStudentCourseFeesLists']})
      }
    },
  })

  // update Course type
  const updateStudentSingleCourseFeesMutation = useMutation({
    mutationFn: async (updateData) => {
      try {
        const res = await axios.put(
          `${BASE_URL}/api/courseFees/${updateData._id}`,
          updateData,
          config
        )
        return res.data // Return the response data
      } catch (error) {
        // Throw an error to be caught in onError
        throw error
      }
    },
    onSuccess: (data) => {
      // Success message
      toast.success('Course fees updated successfully!', {
        bodyStyle: {
          fontSize: '18px',
        },
      })
      queryClient.invalidateQueries({queryKey: ['getStudentCourseFeesLists']})
    },
    onError: (error) => {
      // Check if error.response exists to get the server error message
      const errorMessage = error.response?.data?.message || 'Something went wrong'
      alert(errorMessage)
    },
  })
  // get all students course fees
  const getAllStudentsCourseFees = useQuery({
    queryKey: ['getStudentCourseFeesLists'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/courseFees/allCourseFess`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data:' + error.message)
      }
    },
  })

  return (
    <StudentCourseFeeContext.Provider
      value={{
        useSingleStudentCourseFees,
        useDeleteSingleStudentCourseFees,
        deleteCourseMutation,
        createStudentCourseFeesMutation,
        updateStudentSingleCourseFeesMutation,
        useGetStudentMonthlyCourseFeesCollection,
        useGetStudentMonthlyCourseFeesCollectionExpireationInstallment,
        getAllStudentsCourseFees,
      }}
    >
      {children}
    </StudentCourseFeeContext.Provider>
  )
}

export const useStudentCourseFeesContext = () => {
  const context = useContext(StudentCourseFeeContext)
  if (!context) {
    throw new Error('useAdmissionContext must be used within an AdmissionContextProvider')
  }
  return context
}

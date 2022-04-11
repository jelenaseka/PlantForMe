package utils

import "net/url"

func BuildQuery(values url.Values) string {
	query := " and "
	countParam := 0

	for k, arrV := range values {
		var operator string
		counter := 0
		if len(arrV) == 1 {
			operator = " and "
		} else {
			operator = " or "
		}
		for _, v := range arrV {
			if counter == 0 && len(arrV) > 1 {
				query += "("
			} else if counter == len(arrV)-1 && len(arrV) > 1 {
				operator = ") and "
			}
			if k == "name" {
				query += "pl.name like '%" + v + "%'"
				query += operator
				countParam += 1
			} else if k == "light" {
				query += "pl.light=" + v
				query += operator
				countParam += 1
			} else if k == "watering" {

				query += "pl.watering=" + v
				query += operator
				countParam += 1
			} else if k == "isBlooming" {

				query += "pl.is_blooming=" + v
				query += operator
				countParam += 1
			} else if k == "growthRate" {

				query += "pl.growth_rate=" + v
				query += operator
				countParam += 1
			} else if k == "hardiness" {

				query += "pl.hardiness=" + v
				query += operator
				countParam += 1
			} else if k == "height" {

				query += "pl.height=" + v
				query += operator
				countParam += 1
			} else if k == "lifeTime" {

				query += "pl.life_time=" + v
				query += operator
				countParam += 1
			} else if k == "category" {

				query += "c.name='" + v + "'"
				query += operator
				countParam += 1
				counter++
			} else if k == "bloomingMonth" {

				query += "bm.month=" + v
				query += operator
				countParam += 1
				counter++
			}

		}

	}
	if len(query) > 3 && countParam > 0 {
		query = query[:len(query)-4]
		query += ";"
		return query
	}

	return ";"
}
